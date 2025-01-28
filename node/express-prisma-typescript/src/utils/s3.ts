import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {v4 as uuidv4} from 'uuid';

type PresignedUrlParams = {
  key: string;
  expiresIn?: number;
};

const region = process.env.AWS_REGION as string
const bucketName = 'twitter-backend-demo-a617f6da-58a7-4888-b927-88eaae142243'

const createS3Client = (region: string) => {
  return new S3Client({ 
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
   });
};

export const generatePresignedUrl = async ({key, expiresIn = 36000,}: PresignedUrlParams): Promise<string> => {
  const client = createS3Client(region);
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
  
  try {
    const presignedUrl = await getSignedUrl(client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
};

export const deleteObjectByKey = async (key: string): Promise<DeleteObjectCommandOutput> => {
  const client = createS3Client(region);
  try{
    const data = await client.send(new DeleteObjectCommand({Bucket: bucketName, Key: key}));
    return data
  }catch(error){
    console.error("Error deleting object:", error);
    throw new Error("Failed to delete object");
  }
}

export const generateKeyImage = async (image: string): Promise<string> => {
  let arr = image.split('.')
  let imageName = arr.at(0) as string
  
  return imageName.concat("__"+uuidv4()+'.'+arr.at(1))
}