// @flow
import React from 'react'
import classNames from 'classnames'
import moment from 'moment'

import Button from '../../Button'
import { openExplorerTx } from '../../../core/explorer'
import styles from './Transaction.scss'
import { ASSETS } from '../../../core/constants'
import { isZero } from '../../../core/math'
import { formatBalance } from '../../../core/formatters'
import ClaimIcon from '../../../assets/icons/claim.svg'
import SendIcon from '../../../assets/icons/send-tx.svg'
import ReceiveIcon from '../../../assets/icons/receive-tx.svg'
import ContactsAdd from '../../../assets/icons/contacts-add.svg'
import InfoIcon from '../../../assets/icons/info.svg'
import CopyToClipboard from '../../CopyToClipboard'

type Props = {
  className?: string,
  tx: Object,
  networkId: string,
  explorer: ExplorerType,
  showAddContactModal: ({ address: string }) => null
}

export default class Transaction extends React.Component<Props> {
  render = () => {
    const { tx, className } = this.props
    const { txid, iconType, time, label, amount, to } = tx

    return (
      <div className={styles.transactionContainer}>
        <div className={styles.txTypeIconContainer}>
          {this.renderTxTypeIcon(iconType)}
        </div>
        <div className={styles.txDateContainer}>
          {moment.unix(time).format('MM/DD/YYYY | HH:MM:ss')}
        </div>
        <div className={styles.txLabelContainer}>{label}</div>
        <div className={styles.txAmountContainer}>{amount}</div>
        <div className={styles.txToContainer}>
          {to}
          {to !== 'NETWORK FEES' && (
            <CopyToClipboard
              className={styles.copy}
              text={to}
              tooltip="Copy Public Address"
            />
          )}
        </div>

        {to === 'NETWORK FEES' ? (
          <div className={styles.historyButtonPlaceholder} />
        ) : (
          <Button
            className={styles.transactionHistoryButton}
            renderIcon={ContactsAdd}
            onClick={this.displayModal}
          >
            Add
          </Button>
        )}
        <Button
          className={styles.transactionHistoryButton}
          renderIcon={InfoIcon}
          onClick={this.handleClick}
        >
          View
        </Button>
      </div>
    )
  }

  displayModal = () => {
    const { showAddContactModal, tx } = this.props
    const { to } = tx
    showAddContactModal({ address: to })
  }

  handleClick = () => {
    const { networkId, explorer, tx } = this.props
    const { txid } = tx
    openExplorerTx(networkId, explorer, txid)
  }

  renderTxTypeIcon = (type: string) => {
    switch (type) {
      case 'CLAIM':
        return (
          <div className={styles.claimIconContainer}>
            <ClaimIcon />
          </div>
        )
      case 'SEND':
        return (
          <div className={styles.sendIconContainer}>
            <SendIcon />
          </div>
        )
      case 'RECEIVE':
        return (
          <div className={styles.receiveIconContainer}>
            <ReceiveIcon />
          </div>
        )
      default:
        console.warn('renderTxTypeIcon() invoked with an invalid argument!', {
          type
        })
        return null
    }
  }
}
