// This file displays a table of jobs.

import React from 'react';

const JobTable = ({ jobs }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Posted On</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id}>
            <td>{job.title}</td>
            <td>{job.company}</td>
            <td>{job.location}</td>
            <td>{new Date(job.postedOn).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JobTable;