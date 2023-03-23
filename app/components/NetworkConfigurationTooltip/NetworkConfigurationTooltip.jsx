// @flow
import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { HashRouter, Link } from 'react-router-dom'
import { IntlShape } from 'react-intl'
import { NeoRest } from '@cityofzion/dora-ts/dist/api'

import { ROUTES } from '../../core/constants'
import SettingsItem from '../Settings/SettingsItem'
import SettingsLink from '../Settings/SettingsLink'
import Button from '../Button'
import { findNetworkByDeprecatedLabel } from '../../core/networks'
import themes from '../../themes'
import NeoLogo from '../../assets/icons/neo.svg'
import NodeSelectIcon from '../../assets/icons/node-select.svg'
import BlockExplorerIcon from '../../assets/icons/block-explorer.svg'
import CogIcon from '../../assets/icons/cog-icon.svg'
import networkConfigStyles from '../../containers/NetworkConfiguration/NetworkConfiguration.scss'
import settingsStyles from '../../containers/Settings/Settings.scss'
import styles from './NetworkConfigurationTooltip.scss'
import WarningIcon from '../../assets/icons/warning.svg'

type Props = {
  address: string,
  net: string,
  theme: string,
  publicKey: string,
  selectedNode: string,
  explorer: string,
  intl: IntlShape,
  chain: string,
}

export function renderNode(node: Array<any>) {
  if (node.length === 2) {
    if (node[1] > 21) {
      return (
        <div className={styles.votedNode}>
          {node[0]} <WarningIcon className={styles.warningIcon} />
        </div>
      )
    }
    return (
      <div className={styles.votedNode}>
        {node[0]} #{node[1]}
      </div>
    )
  }
  return (
    <div className={styles.votedNode}>
      <WarningIcon className={styles.warningIcon} />
    </div>
  )
}

export default function NetworkConfigurationTooltip({
  net,
  address,
  theme,
  intl,
  publicKey,
  selectedNode,
  explorer,
  chain,
}: Props = {}) {
  const [node, setNode] = useState([])

  useEffect(() => {
    const getVotedNode = async () => {
      const votedNode = []
      const network = net === 'MainNet' ? 'mainnet' : 'testnet'
      const candidateResponse = await NeoRest.voter(address, network)
      const selectednode = candidateResponse.candidate
      votedNode.push(selectednode)

      const comitteeResponse = await NeoRest.committee(network)
      for (const item of comitteeResponse) {
        if (item.name === selectednode) {
          votedNode.push(comitteeResponse.indexOf(item) + 1)
          break
        }
      }
      setNode(votedNode)
    }

    getVotedNode().catch(console.error)
  }, [])

  return (
    <section
      id="network-config-tooltip"
      style={themes[theme]}
      className={classNames(
        settingsStyles.settingsItemsContainer,
        networkConfigStyles.networkItemsContainer,
        styles.tooltipContainer,
      )}
    >
      <HashRouter>
        <div className={settingsStyles.innerContainer}>
          <div className={styles.addressInfo}>
            <span>
              {intl.formatMessage({
                id: 'networkConfigTooltipAddress',
              })}
            </span>
            <div className={styles.addressLink}> {address}</div>
          </div>
          <div className={styles.votedNodeInfo}>
            <span>
              {intl.formatMessage({
                id: 'networkConfigTooltipVotedNode',
              })}
            </span>
            {renderNode(node)}
          </div>
          {publicKey && (
            <div className={styles.publicKeyInfo}>
              <span>
                {intl.formatMessage({
                  id: 'networkConfigTooltipPublicKey',
                })}
              </span>
              <div className={styles.publicKey}> {publicKey}</div>
            </div>
          )}

          <SettingsLink
            to={ROUTES.NODE_SELECT}
            label={selectedNode || 'AUTOMATIC'}
            renderIcon={() => <NodeSelectIcon />}
            title={intl.formatMessage({
              id: 'networkSettingsNodeSelectLabel',
            })}
            tooltip
            noBorderBottom
            onClick={() => undefined}
          />
          <div className={styles.tooltipItemBorder} />
          <SettingsItem
            renderIcon={() => <BlockExplorerIcon />}
            title={intl.formatMessage({ id: 'networkSettingsExplorerLabel' })}
            tooltip
            noBorderBottom
          >
            <div className={settingsStyles.settingsSelectContainer}>
              <div className={styles.configLabel}>{explorer.toUpperCase()}</div>
            </div>
          </SettingsItem>

          <div className={styles.tooltipItemBorder} />

          <SettingsItem
            renderIcon={() => <NeoLogo />}
            title={intl.formatMessage({ id: 'networkSettingsCurrentLabel' })}
            tooltip
            noBorderBottom
          >
            <div className={networkConfigStyles.settingsSelectContainer}>
              <div className={styles.configLabel}>
                {findNetworkByDeprecatedLabel(net, chain).label.toUpperCase()}
              </div>
            </div>
          </SettingsItem>
          <div className={styles.tooltipItemBorder} />
          <div className={styles.buttonContainer}>
            <Link to={ROUTES.NETWORK_CONFIGURATION}>
              <Button
                shouldCenterButtonLabelText
                elevated
                renderIcon={() => <CogIcon />}
              >
                {intl.formatMessage({
                  id: 'networkConfigTooltipUpdateSettings',
                })}
              </Button>
            </Link>
          </div>
        </div>
      </HashRouter>
    </section>
  )
}
