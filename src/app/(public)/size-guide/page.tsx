'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Tabs } from '@/components/ui/Tabs';

export default function SizeGuidePage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const menSizes = [
    { us: 6, uk: 5, eu: 39, cm: 24.5 },
    { us: 6.5, uk: 5.5, eu: 39.5, cm: 25 },
    { us: 7, uk: 6, eu: 40, cm: 25.5 },
    { us: 7.5, uk: 6.5, eu: 40.5, cm: 26 },
    { us: 8, uk: 7, eu: 41, cm: 26.5 },
    { us: 8.5, uk: 7.5, eu: 41.5, cm: 27 },
    { us: 9, uk: 8, eu: 42, cm: 27.5 },
    { us: 9.5, uk: 8.5, eu: 42.5, cm: 28 },
    { us: 10, uk: 9, eu: 43, cm: 28.5 },
    { us: 10.5, uk: 9.5, eu: 43.5, cm: 29 },
    { us: 11, uk: 10, eu: 44, cm: 29.5 },
    { us: 11.5, uk: 10.5, eu: 44.5, cm: 30 },
    { us: 12, uk: 11, eu: 45, cm: 30.5 },
    { us: 13, uk: 12, eu: 46, cm: 31.5 },
  ];

  const womenSizes = [
    { us: 4, uk: 1.5, eu: 35, cm: 21.5 },
    { us: 4.5, uk: 2, eu: 35.5, cm: 22 },
    { us: 5, uk: 2.5, eu: 36, cm: 22.5 },
    { us: 5.5, uk: 3, eu: 36.5, cm: 23 },
    { us: 6, uk: 3.5, eu: 37, cm: 23.5 },
    { us: 6.5, uk: 4, eu: 37.5, cm: 24 },
    { us: 7, uk: 4.5, eu: 38, cm: 24.5 },
    { us: 7.5, uk: 5, eu: 38.5, cm: 25 },
    { us: 8, uk: 5.5, eu: 39, cm: 25.5 },
    { us: 8.5, uk: 6, eu: 39.5, cm: 26 },
    { us: 9, uk: 6.5, eu: 40, cm: 26.5 },
    { us: 9.5, uk: 7, eu: 40.5, cm: 27 },
    { us: 10, uk: 7.5, eu: 41, cm: 27.5 },
    { us: 10.5, uk: 8, eu: 41.5, cm: 28 },
    { us: 11, uk: 8.5, eu: 42, cm: 28.5 },
  ];

  const kidsSizes = [
    { us: '1C', uk: 0.5, eu: 16, cm: 8.5 },
    { us: '2C', uk: 1, eu: 17, cm: 9 },
    { us: '3C', uk: 1.5, eu: 18, cm: 9.5 },
    { us: '4C', uk: 2, eu: 19, cm: 10 },
    { us: '5C', uk: 2.5, eu: 20, cm: 11 },
    { us: '6C', uk: 3, eu: 21, cm: 11.5 },
    { us: '7C', uk: 3.5, eu: 22, cm: 12 },
    { us: '8C', uk: 4, eu: 23, cm: 13 },
    { us: '9C', uk: 4.5, eu: 24, cm: 14 },
    { us: '10C', uk: 5, eu: 25, cm: 15 },
    { us: '11C', uk: 5.5, eu: 26, cm: 16 },
    { us: '12C', uk: 6, eu: 27, cm: 17 },
    { us: '13C', uk: 6.5, eu: 28, cm: 18 },
    { us: '1Y', uk: 7, eu: 29, cm: 19 },
    { us: '2Y', uk: 7.5, eu: 30, cm: 20 },
    { us: '3Y', uk: 8, eu: 31, cm: 21 },
    { us: '4Y', uk: 8.5, eu: 32, cm: 22 },
    { us: '5Y', uk: 9, eu: 33, cm: 23 },
    { us: '6Y', uk: 9.5, eu: 34, cm: 24 },
    { us: '7Y', uk: 10, eu: 35, cm: 25 },
  ];

  const SizeTable = ({ sizes }: { sizes: any[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-dark text-white">
            <th className="px-4 py-3 text-left font-semibold">US</th>
            <th className="px-4 py-3 text-left font-semibold">UK</th>
            <th className="px-4 py-3 text-left font-semibold">EU</th>
            <th className="px-4 py-3 text-left font-semibold">CM (Foot Length)</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-3 text-brand-dark">{size.us}</td>
              <td className="px-4 py-3 text-brand-dark">{size.uk}</td>
              <td className="px-4 py-3 text-brand-dark">{size.eu}</td>
              <td className="px-4 py-3 text-brand-dark">{size.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <LegalPageLayout title="Size Guide" lastUpdated={currentDate}>
      <section className="mb-8">
        <p className="text-brand-gray mb-6">
          Find your perfect fit with our comprehensive size guide. Measure your foot length and refer to the tables below to find your corresponding size.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-brand-dark mb-6">
          Size Charts
        </h2>
        <Tabs defaultValue="men">
          <Tabs.List>
            <Tabs.Trigger value="men">Men</Tabs.Trigger>
            <Tabs.Trigger value="women">Women</Tabs.Trigger>
            <Tabs.Trigger value="kids">Kids</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="men" className="mt-6">
            <SizeTable sizes={menSizes} />
          </Tabs.Content>
          
          <Tabs.Content value="women" className="mt-6">
            <SizeTable sizes={womenSizes} />
          </Tabs.Content>
          
          <Tabs.Content value="kids" className="mt-6">
            <SizeTable sizes={kidsSizes} />
          </Tabs.Content>
        </Tabs>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          How to Measure Your Foot
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-brand-gray">
          <li>
            <strong>Place your foot on a piece of paper:</strong> Stand with your heel against a wall and your foot flat on the paper.
          </li>
          <li>
            <strong>Mark the longest point:</strong> Use a pen or pencil to mark the tip of your longest toe (this may be your big toe or second toe).
          </li>
          <li>
            <strong>Measure the distance:</strong> Use a ruler to measure the distance from the wall to your mark in centimeters. This is your foot length.
          </li>
        </ol>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Tips for Finding Your Size
        </h2>
        <ul className="list-disc list-inside space-y-2 text-brand-gray">
          <li>Measure both feet and use the larger measurement</li>
          <li>Measure your feet at the end of the day when they are at their largest</li>
          <li>Wear the type of socks you would normally wear with the shoes</li>
          <li>If you are between sizes, size up for better comfort</li>
          <li>Different shoe brands may have slight variations in sizing</li>
        </ul>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Important Notes
        </h2>
        <div className="space-y-3">
          <div className="bg-brand-light-gray p-4 rounded-lg">
            <p className="text-sm text-brand-dark font-semibold">
              💡 If you are between sizes, we recommend sizing up for better comfort.
            </p>
          </div>
          <p className="text-sm text-brand-gray">
            Size charts are for reference. Fit may vary by style.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
