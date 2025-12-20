import { ExternalLink, Github, Heart } from '@nsmr/pixelart-react'
import packageJson from '@/../package.json'
import { Button, Tooltip } from '../ui'
import { SettingsSheet } from './settings-sheet'

export const HeaderPanel = () => (
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
            <Heart />
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
            onClick={() => window.open(packageJson.homepage, '_blank')}
            size='icon'
            variant='outline'>
            <Github />
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

    <SettingsSheet />
  </div>
)
