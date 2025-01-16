'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/app/components/mainLayout';
import dayjs from 'dayjs';

interface Slot {
    time: string;
    status: 'available' | 'booked';
}

type Slots = Record<string, Slot[]>;

const generateWeekSlots = (startDate: string): Slots => {
    const slots: Slots = {};
    for (let i = 0; i < 7; i++) {
        const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
        slots[date] = Array.from({ length: 16 }, (_, index) => {
            const hour = 9 + index;
            return { time: `${hour}:00`, status: 'available' }; // Default all to 'available'
        });
    }
    return slots;
};

export default function Booking() {
    const [currentStartDate, setCurrentStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [slots, setSlots] = useState<Slots>({});
    const [selectedSlots, setSelectedSlots] = useState<{ date: string; time: string }[]>([]);

    useEffect(() => {
        // Initialize slots after hydration
        setSlots(generateWeekSlots(currentStartDate));
    }, [currentStartDate]);

    const handleDateSearch = (date: string) => {
        setCurrentStartDate(date);
        setSlots(generateWeekSlots(date));
    };

    const handleSlotClick = (date: string, time: string, status: 'available' | 'booked') => {
        if (status === 'booked') return;
        const isSelected = selectedSlots.find((slot) => slot.date === date && slot.time === time);
        if (isSelected) {
            setSelectedSlots(selectedSlots.filter((slot) => !(slot.date === date && slot.time === time)));
        } else {
            setSelectedSlots([...selectedSlots, { date, time }]);
        }
    };

    const calculateTotalPrice = (): number => {
        let total = 0;
        selectedSlots.forEach((slot) => {
            const hour = parseInt(slot.time.split(':')[0], 10);
            if (hour >= 9 && hour < 18) total += 1300;
            else if (hour >= 18 && hour < 22) total += 2000;
            else if (hour >= 22 && hour <= 24) total += 1700;
        });
        return total;
    };

    const handleBooking = () => {
        alert('Booking confirmed for selected slots!');
        // Add your booking logic here
    };

    const handleGoBack = () => {
        window.history.back();
    };

    if (!slots[currentStartDate]) {
        return <div>Loading...</div>; // Show a loading indicator during hydration
    }

    return (
        <MainLayout>
            <div className="w-[1200px] p-8 mx-auto">
                <div className="flex justify-end items-center mb-4">
                    <input
                        type="date"
                        value={currentStartDate}
                        onChange={(e) => handleDateSearch(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-center border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 text-white">TIME</th>
                                {Object.keys(slots).map((date) => (
                                    <th key={date} className="border border-gray-300 text-white">
                                        {dayjs(date).format('DD MMM YYYY')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {slots[currentStartDate]?.map((_, index) => {
                                const time = slots[currentStartDate][index].time;
                                return (
                                    <tr key={time}>
                                        <td className="border border-gray-300 text-white">{time}</td>
                                        {Object.keys(slots).map((date) => (
                                            <td
                                                key={`${date}-${time}`}
                                                onClick={() =>
                                                    handleSlotClick(date, time, slots[date][index].status)
                                                }
                                                className={`border border-gray-300 cursor-pointer ${slots[date][index].status === 'available'
                                                        ? selectedSlots.find(
                                                            (slot) => slot.date === date && slot.time === time
                                                        )
                                                            ? 'bg-blue-500'
                                                            : 'bg-green-500'
                                                        : 'bg-red-500 cursor-not-allowed'
                                                    }`}
                                            ></td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-4 bg-white shadow rounded">
                    <h3 className="text-lg font-bold mt-2">Total Price: {calculateTotalPrice()} บาท</h3>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleGoBack}
                            className="w-full mr-2 p-3 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handleBooking}
                            className="w-full ml-2 p-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
