import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Icon assets
const ICON_TICKET = '/icons/ticket.svg';
const ICON_ANGLE_DOWN = '/icons/angle-down.svg';
const ICON_PEN_TO_SQUARE = '/icons/pen-to-square-alt.svg';
const ICON_INFO = '/icons/info.svg';
const ICON_CALENDAR = '/icons/calendar.svg';
const ICON_CLOCK = '/icons/clock.svg';
const ICON_EYE = '/icons/eye.svg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background-main">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {/* Hero Section */}
          <div className="bg-background-contrast p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-white text-base">Events</span>
              </div>
              <h1 className="text-white text-xl font-semibold">Schedule & tickets</h1>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 max-w-[386px]">
                <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative">
                  <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">City</label>
                  <div className="pt-4 text-text-main text-base">Chicago</div>
                  <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative">
                  <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Search or type event</label>
                  <div className="pt-4 text-text-main text-base">LIV Golf Chicago 2025</div>
                  <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 max-w-[386px]">
                <div className="bg-white border border-border-main rounded-sm h-14 px-3 flex flex-col justify-center relative">
                  <label className="text-text-subtle text-xs font-semibold absolute top-0 left-3">Venue</label>
                  <div className="pt-4 text-text-main text-base">Bolingbrook Golf Club</div>
                  <svg className="absolute right-3 top-[18px] w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white p-4">
            <div className="bg-neutral-50 rounded-sm p-4">
              {/* Tabs */}
              <div className="flex items-end gap-1 border-b border-border-main">
                <div className="px-3 py-2 h-10 border-b border-border-main text-text-main text-center">
                  Calendar view
                </div>
                <div className="px-3 py-2 h-10 border-b-2 border-primary-active text-primary-active text-base font-semibold text-center">
                  Tickets per time slot
                </div>
                <div className="px-3 py-2 h-10 border-b border-border-main text-text-main text-center">
                  Prices per time slot
                </div>
                <div className="px-3 py-2 h-10 border-b border-border-main text-text-main text-center">
                  Time slots
                </div>
                <div className="px-3 py-2 h-10 border-b border-border-main text-text-main text-center">
                  Rules
                </div>
                <div className="flex-1 border-b border-border-main"></div>
              </div>

              {/* Date Picker and Manage Quotas Button */}
              <div className="mt-4 flex items-center justify-between">
                <div className="w-[297px]">
                  <div className="bg-white border border-border-main rounded-lg h-14 flex items-center">
                    <div className="flex-1 px-3 pr-11 flex flex-col justify-center relative">
                      <label className="text-text-subtle text-xs absolute top-0 left-3">Date</label>
                      <div className="pt-4 text-text-main text-base">07/27</div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                        <img src={ICON_CALENDAR} alt="" className="w-[14px] h-4" />
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border-main"></div>
                    <div className="flex-1 px-3 pr-11 flex flex-col justify-center relative">
                      <label className="text-text-subtle text-xs absolute top-0 left-3">Hour</label>
                      <div className="pt-4 text-text-main text-base">10:30</div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                        <img src={ICON_CLOCK} alt="" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/quota-management')}
                  className="border-2 border-border-main rounded-full px-3 h-8 text-primary-active text-sm font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Manage Quotas
                </button>
              </div>

              {/* Time Slot Header */}
              <div className="mt-6">
                <div className="bg-neutral-75 rounded-lg p-3 flex items-center">
                  <div className="flex-1 text-text-main text-base font-semibold">Sun, 18 Jan 2024 - 10:30 AM</div>
                  <div className="w-[100px] flex flex-col items-center justify-start">
                    <div className="text-text-subtle text-xs mb-0.5">Status</div>
                  </div>
                  <div className="w-[100px] flex flex-col items-center justify-start">
                    <div className="text-text-subtle text-xs mb-0.5">Visibility</div>
                  </div>
                  <div className="w-[100px] flex flex-col items-end justify-start">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <span className="text-text-subtle text-xs">Issued</span>
                      <img src={ICON_INFO} alt="" className="w-3 h-3" />
                    </div>
                    <div className="text-text-main text-base font-semibold">350</div>
                  </div>
                  <div className="w-[100px] flex flex-col items-end justify-start">
                    <div className="text-text-subtle text-xs mb-0.5">Available</div>
                    <div className="text-text-main text-base font-semibold">450</div>
                  </div>
                  <div className="w-[100px] flex flex-col items-end justify-start">
                    <div className="text-text-subtle text-xs mb-0.5">T. Capacity</div>
                    <div className="text-text-main text-base font-semibold">800</div>
                  </div>
                  <div className="w-[100px] flex flex-col items-end justify-start">
                    <div className="text-text-subtle text-xs mb-0.5">Occupancy</div>
                    <div className="text-text-main text-base font-semibold">75%</div>
                  </div>
                  <div className="w-[40px] flex justify-center">
                    <div className="w-5 h-5 flex items-center justify-center relative">
                      <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Capacity Groups */}
                <div className="mt-6 space-y-4">
                  {/* Fanstand Group */}
                  <div className="bg-white border border-border-main rounded-lg overflow-hidden p-3">
                    <div className="bg-white border-b border-dashed border-border-main pb-3 flex items-center">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-[26px] h-[26px] flex items-center justify-center relative">
                          <img src={ICON_ANGLE_DOWN} alt="" className="w-[15px] h-[9px]" />
                        </div>
                        <div>
                          <div className="text-text-subtle text-xs">Capacity Group</div>
                          <div className="text-text-main text-base font-semibold">Fanstand</div>
                        </div>
                      </div>
                      <div className="w-[100px] flex items-center justify-center"></div>
                      <div className="w-[100px] flex items-center justify-center"></div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">250</div>
                      </div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">350</div>
                      </div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">600</div>
                      </div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">41.7%</div>
                      </div>
                      <div className="w-[40px] flex justify-center">
                        <div className="w-5 h-5 flex items-center justify-center relative">
                          <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 flex flex-col gap-6 mt-4">
                      <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-[18px] h-[18px] flex items-center justify-center relative">
                            <img src={ICON_TICKET} alt="" className="w-4 h-[11px]" />
                          </div>
                          <span className="text-text-main text-sm">Fanstand | Friday (June 26)</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 bg-status-positive text-white rounded text-xs h-5 flex items-center justify-center min-w-[48px]">On-sale</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 border border-text-main text-text-main rounded text-xs flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center relative">
                              <img src={ICON_EYE} alt="" className="w-[13.5px] h-[10.5px]" />
                            </div>
                            Visible
                          </span>
                        </div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">200</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">100</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">300</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">66.67%</div>
                        <div className="w-[40px] flex justify-center">
                          <div className="w-5 h-5 flex items-center justify-center relative">
                            <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-[18px] h-[18px] flex items-center justify-center relative">
                            <img src={ICON_TICKET} alt="" className="w-4 h-[11px]" />
                          </div>
                          <span className="text-text-main text-sm">Fanstand | 3 days pass</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 bg-status-positive text-white rounded text-xs h-5 flex items-center justify-center min-w-[48px]">On-sale</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 border border-text-main text-text-main rounded text-xs flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center relative">
                              <img src={ICON_EYE} alt="" className="w-[13.5px] h-[10.5px]" />
                            </div>
                            Visible
                          </span>
                        </div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">250</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">300</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">16.67%</div>
                        <div className="w-[40px] flex justify-center">
                          <div className="w-5 h-5 flex items-center justify-center relative">
                            <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Club 54 Group */}
                  <div className="bg-white border border-border-main rounded-lg overflow-hidden p-3">
                    <div className="bg-white border-b border-dashed border-border-main pb-3 flex items-center">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-[26px] h-[26px] flex items-center justify-center relative">
                          <img src={ICON_ANGLE_DOWN} alt="" className="w-[15px] h-[9px]" />
                        </div>
                        <div>
                          <div className="text-text-subtle text-xs">Capacity Group</div>
                          <div className="text-text-main text-base font-semibold">Club 54</div>
                        </div>
                      </div>
                      <div className="w-[100px] flex items-center justify-center"></div>
                      <div className="w-[100px] flex items-center justify-center"></div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">100</div>
                      </div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">100</div>
                      </div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">200</div>
                      </div>
                      <div className="w-[100px] flex items-center justify-end">
                        <div className="text-text-main text-base font-semibold">50%</div>
                      </div>
                      <div className="w-[40px] flex justify-center">
                        <div className="w-5 h-5 flex items-center justify-center relative">
                          <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 flex flex-col gap-6 mt-4">
                      <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-[18px] h-[18px] flex items-center justify-center relative">
                            <img src={ICON_TICKET} alt="" className="w-4 h-[11px]" />
                          </div>
                          <span className="text-text-main text-sm">Club 54 | Friday (June 26)</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 bg-status-positive text-white rounded text-xs h-5 flex items-center justify-center min-w-[48px]">On-sale</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 border border-text-main text-text-main rounded text-xs flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center relative">
                              <img src={ICON_EYE} alt="" className="w-[13.5px] h-[10.5px]" />
                            </div>
                            Visible
                          </span>
                        </div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">100</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50%</div>
                        <div className="w-[40px] flex justify-center">
                          <div className="w-5 h-5 flex items-center justify-center relative">
                            <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-[18px] h-[18px] flex items-center justify-center relative">
                            <img src={ICON_TICKET} alt="" className="w-4 h-[11px]" />
                          </div>
                          <span className="text-text-main text-sm">Club 54 | 3 days pass</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 bg-status-positive text-white rounded text-xs h-5 flex items-center justify-center min-w-[48px]">On-sale</span>
                        </div>
                        <div className="w-[100px] flex items-center justify-center">
                          <span className="px-1 py-0.5 border border-text-main text-text-main rounded text-xs flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center relative">
                              <img src={ICON_EYE} alt="" className="w-[13.5px] h-[10.5px]" />
                            </div>
                            Visible
                          </span>
                        </div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">100</div>
                        <div className="w-[100px] flex items-center justify-end text-text-main">50%</div>
                        <div className="w-[40px] flex justify-center">
                          <div className="w-5 h-5 flex items-center justify-center relative">
                            <img src={ICON_PEN_TO_SQUARE} alt="" className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

