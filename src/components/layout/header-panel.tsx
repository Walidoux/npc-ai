import {
  DropHalf as CarbonFootPrintIcon,
  ExternalLink,
  Github as SourceCodeIcon,
  Heart as SupportIcon,
} from '@nsmr/pixelart-react'
import packageJson from '@/../package.json'
import { Button, Tooltip } from '../ui'
import { SettingsSheet } from './settings-sheet'

type HeaderPanelProps = {
  onCO2Click?: () => void
}

export const HeaderPanel = ({ onCO2Click }: HeaderPanelProps) => (
  <div className='fixed top-4 right-4 flex gap-2'>
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button
            onClick={() =>
              window.open('https://buymeacoffee.com/walidkorchi', '_blank')
            }
            size='icon'
            variant='outline'>
            <SupportIcon />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className='inline-flex gap-x-2 font-head'
          variant='solid'>
          <ExternalLink size={18} />
          Buy me a Coffee
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>

    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button
            onClick={() => window.open(packageJson.repository.url, '_blank')}
            size='icon'
            variant='outline'>
            <SourceCodeIcon />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className='inline-flex gap-x-2 font-head'
          variant='solid'>
          <ExternalLink size={18} />
          Source Code
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>

    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button onClick={onCO2Click} size='icon' variant='outline'>
            <CarbonFootPrintIcon />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className='inline-flex gap-x-2 font-head'
          variant='solid'>
          <ExternalLink size={18} />
          CO2 Emission
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>

    <SettingsSheet />
  </div>
)
