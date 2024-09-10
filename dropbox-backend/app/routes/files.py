from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import File as FileModel
from app.schemas import FileSchema
import boto3
from botocore.exceptions import NoCredentialsError
from typing import List
import os
from dotenv import load_dotenv 


load_dotenv() 
router = APIRouter()


AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1") 
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "my-dropbox-clone-bucket")

# Initialize the S3 client using the credentials from environment variables
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

@router.post("/uploadfile/")
async def upload_file_to_s3(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        s3_file_name = file.filename
        s3_client.upload_fileobj(file.file, S3_BUCKET_NAME, s3_file_name)

        file_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{s3_file_name}"

        # Save file info to the database
        db_file = FileModel(
            filename=s3_file_name,
            filepath=file_url,
            content_type=file.content_type
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        return {"filename": s3_file_name, "file_url": file_url}

    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not available")

@router.get("/files/", response_model=List[FileSchema])
def get_files(db: Session = Depends(get_db)):
    files = db.query(FileModel).all()
    return files

@router.get("/download/{file_id}")
def download_file_from_s3(file_id: int, db: Session = Depends(get_db)):
    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return {"file_url": file.filepath}
