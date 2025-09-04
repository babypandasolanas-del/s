import React from 'react';
import { Instagram, Music } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0a0f1a] text-gray-400 py-6 flex flex-col items-center gap-3">
      <div className="flex gap-6">
        {/* Instagram */}
        <a
          href="https://instagram.com/selflevelings"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors"
          aria-label="Follow us on Instagram"
        >
          <Instagram size={28} />
        </a>

        {/* TikTok */}
        <a
          href="https://tiktok.com/@selflevelings"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-100 transition-colors"
          aria-label="Follow us on TikTok"
        >
          <Music size={28} />
        </a>
      </div>

      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} SelfLeveling. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;