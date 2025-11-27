// src/app/api/jobs/[id]/route.js
import { connectToDatabase } from '../../../lib/mongodb';
import Job from '../../../models/Job';

export const GET = async (req, { params }) => {
  const { id } = params;

  try {
    const db = await connectToDatabase();
    const job = await db.collection('jobs').findOne({ _id: id });

    if (!job) {
      return new Response(JSON.stringify({ message: 'Job not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(job), { status: 200 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};