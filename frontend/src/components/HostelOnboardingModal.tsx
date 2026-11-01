import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building, DoorOpen, CheckCircle, ShieldCheck, Sparkles, X, MapPin } from 'lucide-react';

const BOYS_BLOCKS = [
  'Boys Block 1',
  'Boys Block 2',
  'Boys Block 3',
  'Boys Block 4',
  'Boys Block 5',
  'Boys Block 6',
  'Boys Block 7',
  'Boys Block 8',
];

const GIRLS_BLOCKS = [
  'Girls Block 1',
  'Girls Block 2',
  'Special Block',
];

interface HostelOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

export const HostelOnboardingModal: React.FC<HostelOnboardingModalProps> = ({
  isOpen,
  onClose,
  isMandatory = false,
}) => {
  const { user, updateHostelLocation } = useAuth();

  const currentBlock = user?.studentProfile?.room?.floor?.block?.name || 'Boys Block 1';
  const currentRoom = user?.studentProfile?.room?.roomNum || '301';
  const isGirlsInit = currentBlock.toLowerCase().includes('girls') || currentBlock.toLowerCase().includes('special');

  const [hostelType, setHostelType] = useState<'BOYS' | 'GIRLS'>(isGirlsInit ? 'GIRLS' : 'BOYS');
  const [selectedBlock, setSelectedBlock] = useState<string>(currentBlock);
  const [roomNumber, setRoomNumber] = useState<string>(currentRoom);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen && user) {
      const blk = user.studentProfile?.room?.floor?.block?.name || 'Boys Block 1';
      const rm = user.studentProfile?.room?.roomNum || '301';
      setSelectedBlock(blk);
      setRoomNumber(rm);
      setHostelType(blk.toLowerCase().includes('girls') || blk.toLowerCase().includes('special') ? 'GIRLS' : 'BOYS');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentBlockOptions = hostelType === 'BOYS' ? BOYS_BLOCKS : GIRLS_BLOCKS;
  const calculatedFloor = parseInt((roomNumber || '301').replace(/\D/g, '')[0]) || 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      setErrorMsg('Please enter a valid room number (e.g. 304)');
      return;
    }

    setErrorMsg('');
    updateHostelLocation(selectedBlock, roomNumber.trim());
    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-[#000000] rounded-[30px] p-6 md:p-8 space-y-6 shadow-none text-[#000000]">
        {/* Top Decorative Pill */}
        <div className="flex items-center justify-between">
          <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#ffd731] text-[#000000] border border-[#000000] flex items-center gap-1.5 transform -rotate-1">
            <Sparkles className="h-3.5 w-3.5 text-[#000000]" />
            PERMANENT HOSTEL ALLOCATION
          </span>

          {!isMandatory && (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4 text-[#000000]" />
            </button>
          )}
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-[#5c4ade] text-white border border-[#000000] flex items-center justify-center font-bold">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#000000] font-['Space_Grotesk',sans-serif]">
                {isMandatory ? 'Set Your Hostel Location' : 'Update Permanent Location'}
              </h2>
              <p className="text-xs font-medium text-[#000000] opacity-80">
                This room number & block will be permanently linked to your student account ({user?.studentProfile?.registrationNo || '25BHI10021'}).
              </p>
            </div>
          </div>
        </div>

        {savedSuccess ? (
          <div className="p-6 rounded-[20px] bg-[#55db9c] text-[#000000] border border-[#000000] text-center space-y-3 animate-scaleUp">
            <CheckCircle className="h-10 w-10 text-[#000000] mx-auto stroke-[2.5]" />
            <h3 className="text-xl font-extrabold">Location Saved Permanently!</h3>
            <p className="text-xs font-bold">
              Allocated: <span className="underline">{selectedBlock} &bull; Room {roomNumber} (Floor {calculatedFloor})</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-[12px] bg-[#fb4903]/10 text-[#fb4903] border border-[#fb4903] text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Hostel Type Select */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                1. Select Hostel Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setHostelType('BOYS');
                    if (!BOYS_BLOCKS.includes(selectedBlock)) setSelectedBlock(BOYS_BLOCKS[0]);
                  }}
                  className={`py-2.5 px-4 rounded-[1600px] border border-[#000000] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    hostelType === 'BOYS'
                      ? 'bg-[#4da2ff] text-white shadow-none'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-slate-50'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Boys Hostel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHostelType('GIRLS');
                    if (!GIRLS_BLOCKS.includes(selectedBlock)) setSelectedBlock(GIRLS_BLOCKS[0]);
                  }}
                  className={`py-2.5 px-4 rounded-[1600px] border border-[#000000] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    hostelType === 'GIRLS'
                      ? 'bg-[#e9ccff] text-[#000000] shadow-none'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-slate-50'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Girls Hostel</span>
                </button>
              </div>
            </div>

            {/* Block Select */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                2. Select Hostel Block
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full p-3 rounded-[16px] bg-[#ffffff] border border-[#000000] text-xs font-bold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5c4ade] cursor-pointer"
              >
                {currentBlockOptions.map((blk) => (
                  <option key={blk} value={blk}>
                    {blk}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Number Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">
                  3. Enter Room Number
                </label>
                <span className="text-[11px] font-bold text-[#000000] opacity-80">
                  Floor: {calculatedFloor}
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <DoorOpen className="h-4 w-4 text-[#000000]" />
                </div>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 304 or 102"
                  className="w-full pl-10 pr-4 py-3 rounded-[16px] bg-[#ffffff] border border-[#000000] text-xs font-bold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5c4ade]"
                  required
                />
              </div>
            </div>

            {/* Preview Summary Card */}
            <div className="p-4 rounded-[16px] bg-[#e9ccff]/50 border border-[#000000] flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#5c4ade] shrink-0" />
              <div className="text-xs font-bold text-[#000000]">
                <span>Allocation Preview: </span>
                <span className="bg-[#ffd731] px-2 py-0.5 rounded-[6px] border border-[#000000] font-black">
                  {selectedBlock} &bull; Room {roomNumber || '---'} (Floor {calculatedFloor})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {!isMandatory && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-3 px-4 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className={`${
                  isMandatory ? 'w-full' : 'w-1/2'
                } py-3 px-4 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#45ca8b] cursor-pointer shadow-none transition-colors`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Save Permanent Location</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
