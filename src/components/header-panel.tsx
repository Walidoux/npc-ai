import { ExternalLink, Github } from '@nsmr/pixelart-react'
import packageJson from '../../package.json'
import { SettingsSheet } from './settings-sheet'
import { Button, Tooltip } from './ui'

export const HeaderPanel = () => (
  <div className='fixed top-4 right-4 flex gap-2'>
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
          Consulter le code
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>

    <SettingsSheet />
  </div>
)
