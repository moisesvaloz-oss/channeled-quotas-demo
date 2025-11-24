import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-background-contrast text-white py-12 border-t border-border-contrast">
      <div className="px-8 w-full">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8">
            <div className="flex items-end gap-[3.5px]">
              <div className="text-white text-[28px] font-bold leading-none">fever</div>
              <div className="text-background-subtle-medium text-[8.55px] font-normal leading-none mb-[5px] uppercase tracking-wide">zone</div>
            </div>
          </div>
          
          <div className="flex gap-24 text-sm">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold mb-2">How Fever Works</h3>
              <a href="#" className="text-white hover:underline">FeverZone Guide</a>
              <a href="#" className="text-white hover:underline">Frequently Asked Questions</a>
              <a href="#" className="text-white hover:underline">Validation Guide</a>
              <a href="#" className="text-white hover:underline">How to validate tickets</a>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-bold mb-2">Partners' support contact</h3>
              <a href="tel:(667) 244-3490" className="text-white hover:underline">(667) 244-3490</a>
              <span className="text-white">Monday to Friday (08:00 - 20:30)</span>
              <a href="#" className="text-white hover:underline">Send us a message</a>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-text-subtle pt-8 border-t border-border-contrast">
          <span>©2025 Fever</span>
          <span>v. 11.00.6</span>
        </div>
      </div>
    </footer>
  );
}

