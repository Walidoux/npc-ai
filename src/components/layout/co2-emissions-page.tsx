import { ArrowLeft, DropHalf, Wind } from '@nsmr/pixelart-react'
import { Button, Card, Select } from '@/components/ui'
import { useCarbonFootprint } from '@/utils/hooks'
import { Text } from '../ui/text'

type CO2EmissionsPageProps = {
  onBack: () => void
}

export const CO2EmissionsPage = ({ onBack }: CO2EmissionsPageProps) => {
  const views = [100, 500, 1000, 10_000, 25_000, 50_000, 75_000, 100_000]
  const [selectedView, setSelectedView] = useState(views[2].toString())
  const [nodeCount, setNodeCount] = useState(0)
  const { transferSizeMB, co2Gram_perView, waterLiter_perView } =
    useCarbonFootprint(Number.parseInt(selectedView, 10))

  useEffect((): void => {
    setNodeCount(document.querySelectorAll('*').length)
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-8 pt-26 font-head'>
      <Button className='fixed top-4 left-4' onClick={onBack} variant='outline'>
        <ArrowLeft className='mr-2' size={18} />
        Back to Chat
      </Button>

      <div className='mb-8 text-center'>
        <Text as='h1' className='mx-auto mb-4 max-w-[750px] px-6'>
          Real-time Environmental Footprint Tracker : CO2 + Blue Water
          Consumption
        </Text>
        <Text className='text-lg text-muted-foreground'>
          Monitor your environmental impact from AI conversations
        </Text>
        <Text className='mt-4 text-sm'>
          For
          <Select onValueChange={setSelectedView} value={selectedView}>
            <Select.Trigger className='mx-3 inline-flex min-w-20!'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content className='min-w-20!'>
              <Select.Group>
                {views.map((option) => (
                  <Select.Item
                    key={option.toString()}
                    value={option.toString()}>
                    {option.toLocaleString('en')}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select>
          monthly page views, this web page's foot-print is:
        </Text>
      </div>

      <div className='mb-8 max-w-2xl rounded-lg border bg-card p-6 shadow-sm'>
        <Text as='h2' className='mb-4'>
          Current Session
        </Text>
        <div className='grid grid-cols-2 gap-4'>
          <div className='rounded border p-4'>
            <div className='font-bold text-2xl'>{nodeCount}</div>
            <div className='text-muted-foreground text-sm'>Nodes in DOM</div>
          </div>
          <div className='rounded border p-4'>
            <div className='font-bold text-2xl'>
              {transferSizeMB.toFixed(2)} MB
            </div>
            <div className='text-muted-foreground text-sm'>Data Transfer</div>
          </div>
        </div>
      </div>

      <div className='grid max-w-4xl grid-cols-2 gap-6'>
        <Card>
          <Card.Header>
            <Card.Title>Greenhouse Gas Emissions</Card.Title>
            <Card.Description>
              Carbon emissions for {selectedView} monthly page views
            </Card.Description>
          </Card.Header>
          <Card.Content className='inline-flex w-full justify-between'>
            <Wind
              className='min-w-[60px] border p-3 text-green-600'
              size={60}
            />
            <div className='w-full text-center'>
              <div className='font-bold text-3xl text-green-600'>
                {co2Gram_perView.toFixed(3)} g
              </div>
              <div className='mt-2 text-muted-foreground text-sm'>
                CO2 per view
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Blue Water Consumption</Card.Title>
            <Card.Description>
              Water usage for {selectedView} monthly page views
            </Card.Description>
          </Card.Header>
          <Card.Content className='inline-flex w-full justify-between'>
            <DropHalf
              className='min-w-[60px] border p-3 text-blue-600'
              size={60}
            />
            <div className='w-full text-center'>
              <div className='font-bold text-3xl text-blue-600'>
                {waterLiter_perView.toFixed(3)} L
              </div>
              <div className='mt-2 text-muted-foreground text-sm'>
                Liters per view
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className='col-span-2'>
          <Card.Header>
            <Card.Title>What is this all about ?</Card.Title>
            <Card.Description>
              Find out in depth about{' '}
              <a
                href='https://raphael-lemaire.com/2020/02/02/mise-en-perspective-suite/'
                rel='noopener'
                target='_blank'>
                the ecological impacts of digital technology into perspective
              </a>
            </Card.Description>
          </Card.Header>
          <Card.Content className='space-y-4'>
            <Text>
              To give you an idea, 1 kg CO2e is equivalent to a journey of
              around <b>5 km by car</b>. A shower uses an average of 6 liters of
              water per minute.
            </Text>
            <Text>
              If a page emits <b>1,7g CO2e</b> and uses <b>2,5cl of water</b>,
              that means that for {selectedView} monthly visitors, the footprint
              is <b>1,7kg de CO2e and 25 litres of water</b> per month -
              equivalent to a 5.5km car journey and a 4-minute shower.
            </Text>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
