// src/app/api/jobs/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Job from '../../../models/Job';

export async function GET(request) {
  const { db } = await connectToDatabase();
  const jobs = await db.collection('jobs').find({}).toArray();
  return NextResponse.json(jobs);
}

export async function POST(request) {
  const { title, description, company } = await request.json();
  
  const { db } = await connectToDatabase();
  const newJob = new Job({ title, description, company });
  
  await db.collection('jobs').insertOne(newJob);
  return NextResponse.json(newJob, { status: 201 });
}