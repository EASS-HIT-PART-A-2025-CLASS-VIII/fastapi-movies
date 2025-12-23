import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import apiClient from '../api/client';

export const Reports: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);

  const fetchFiles = async () => {
    try {
      // Notice the clean route matching the backend router prefix
      const res = await apiClient.get('/transactions/report/list');
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to load reports");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Reports History</h1>
      <div className="grid gap-4">
        {files.map(file => (
          <div key={file} className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="text-[#8b949e]" size={20} />
              <span className="text-white">{file}</span>
            </div>
            {/* Direct link to the StaticFiles mount in main.py */}
            <a
              href={`http://localhost:8000/reports-files/${file}`}
              target="_blank"
              className="text-[#58a6ff] hover:underline flex items-center gap-1"
            >
              <Download size={16} /> Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};