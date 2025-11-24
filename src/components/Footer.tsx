import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-background-contrast text-white py-12 border-t border-border-contrast">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8">
            <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.4545 20.7273V11.0909H17.5455V7.45455H12.4545V5.63636C12.4545 4.54545 13.1818 3.81818 14.2727 3.81818H17.5455V0.181818H13.9091C9.90909 0.181818 8.45455 2.36364 8.45455 5.27273V7.45455H5.18182V11.0909H8.45455V20.7273H12.4545ZM27.3636 21.0909C32.0909 21.0909 35.3636 17.8182 35.3636 13.0909C35.3636 8.72727 32.4545 5.09091 27.3636 5.09091C22.6364 5.09091 19.3636 8.36364 19.3636 13.0909C19.3636 17.4545 22.2727 21.0909 27.3636 21.0909ZM27.3636 17.8182C24.4545 17.8182 22.6364 15.6364 22.6364 13.0909C22.6364 10.5455 24.4545 8.36364 27.3636 8.36364C30.2727 8.36364 32.0909 10.5455 32.0909 13.0909C32.0909 15.6364 30.2727 17.8182 27.3636 17.8182ZM47.7273 20.7273L53.5455 5.45455H49.5455L45.5455 16.7273L41.5455 5.45455H37.5455L43.3636 20.7273H47.7273ZM64.8182 21.0909C69.5455 21.0909 72.8182 17.8182 72.8182 13.0909C72.8182 8.72727 69.9091 5.09091 64.8182 5.09091C60.0909 5.09091 56.8182 8.36364 56.8182 13.0909C56.8182 17.4545 59.7273 21.0909 64.8182 21.0909ZM64.8182 17.8182C61.9091 17.8182 60.0909 15.6364 60.0909 13.0909C60.0909 10.5455 61.9091 8.36364 64.8182 8.36364C67.7273 8.36364 69.5455 10.5455 69.5455 13.0909C69.5455 15.6364 67.7273 17.8182 64.8182 17.8182ZM80.0909 20.7273V11.0909H83.7273V12.5455C84.4545 11.4545 85.5455 11.0909 86.6364 11.0909C87.0909 11.0909 87.4545 11.1818 87.7273 11.2727V14.5455C87.3636 14.3636 86.8182 14.2727 86.2727 14.2727C84.4545 14.2727 83.3636 15.7273 83.3636 17.8182V20.7273H80.0909ZM4.81818 20.7273H8.45455V18.5455H4.81818V20.7273ZM4.81818 16.7273H8.45455V14.5455H4.81818V16.7273Z" fill="white"/>
            </svg>
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
              <span className="text-text-subtle">Monday to Friday (08:00 - 20:30)</span>
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

