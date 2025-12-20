import { ArrowLeft } from '@nsmr/pixelart-react'
import { useState } from 'react'
import { Select } from '@/components/retroui/Select'
import { Button } from '@/components/ui'
import { useCarbonFootprint } from '@/utils/hooks'

type CO2EmissionsPageProps = {
  onBack: () => void
}

export const CO2EmissionsPage = ({ onBack }: CO2EmissionsPageProps) => {
  const [selectedViews, setSelectedViews] = useState('1000')
  const { transferSizeMB, co2Gram_perView, waterLiter_perView } =
    useCarbonFootprint(Number.parseInt(selectedViews, 10))

  const viewOptions = [
    { value: '100', label: '100' },
    { value: '500', label: '500' },
    { value: '1000', label: '1,000' },
    { value: '5000', label: '5,000' },
    { value: '10000', label: '10,000' },
    { value: '25000', label: '25,000' },
    { value: '50000', label: '50,000' },
    { value: '75000', label: '70,000' },
    { value: '100000', label: '100,000' },
  ]

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8 font-head'>
      <div className='mb-8 text-center'>
        <h1 className='mx-auto mb-4 max-w-[500px] font-bold text-3xl'>
          Environmental Footprint Tracker : CO2 + Blue Water Consumption
        </h1>
        <p className='text-lg text-muted-foreground'>
          Monitor your environmental impact from AI conversations
        </p>
        <p className='mt-4 text-sm'>
          For
          <Select onValueChange={setSelectedViews} value={selectedViews}>
            <Select.Trigger className='mx-3 inline-flex min-w-20!'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content className='min-w-20!'>
              <Select.Group>
                {viewOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
          monthly page views, this web page's foot-print is:
        </p>
      </div>

      <div className='mb-8 max-w-2xl rounded-lg border bg-card p-6 shadow-sm'>
        <h2 className='mb-4 font-semibold text-xl'>Current Session</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div className='rounded border p-4'>
            <div className='font-bold text-2xl text-green-600'>
              {co2Gram_perView.toFixed(3)} g
            </div>
            <div className='text-muted-foreground text-sm'>CO2 Emissions</div>
          </div>
          <div className='rounded border p-4'>
            <div className='font-bold text-2xl text-blue-600'>
              {transferSizeMB.toFixed(2)} MB
            </div>
            <div className='text-muted-foreground text-sm'>Data Transfer</div>
          </div>
        </div>
      </div>

      <div className='mb-8 max-w-2xl rounded-lg border bg-card p-6 shadow-sm'>
        <h2 className='mb-4 font-semibold text-xl'>Environmental Impact</h2>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span>Data transferred</span>
            <span className='font-medium'>{transferSizeMB.toFixed(2)} MB</span>
          </div>
          <div className='flex justify-between'>
            <span>CO2 emissions</span>
            <span className='font-medium'>
              {co2Gram_perView.toFixed(3)} grams
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Water usage</span>
            <span className='font-medium'>
              {waterLiter_perView.toFixed(3)} liters
            </span>
          </div>
        </div>
      </div>

      <div className='text-center'>
        <p className='mb-4 text-muted-foreground text-sm'>
          Real-time carbon footprint tracking.
        </p>
        <Button
          className='fixed top-4 left-4'
          onClick={onBack}
          variant='outline'>
          <ArrowLeft className='mr-2' size={18} />
          Back to Chat
        </Button>
      </div>
    </div>
  )
}
