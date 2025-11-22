import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextResponse } from "next/server";

// DELETE Job
export async function DELETE(request, { params }) {
  // ফিক্স: await params ব্যবহার করতে হবে
  const { id } = await params;
  
  await dbConnect();
  await Job.findByIdAndDelete(id);
  
  return NextResponse.json({ success: true, message: "Job Deleted" });
}

// UPDATE Job (Status, Viva Date etc.)
export async function PUT(request, { params }) {
  // ফিক্স: await params ব্যবহার করতে হবে
  const { id } = await params;
  
  const body = await request.json();
  await dbConnect();
  
  const updatedJob = await Job.findByIdAndUpdate(id, body, {
    new: true, // আপডেট হওয়ার পর নতুন ডাটা ফেরত দেবে
    runValidators: true,
  });
  
  if (!updatedJob) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updatedJob });
}