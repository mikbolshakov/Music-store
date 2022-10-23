import React from 'react';

type WaitingForTransactionMessageProps = {
  tsHash: string;
};

const WaitingForTransactionMessage: React.FunctionComponent<WaitingForTransactionMessageProps> = 
({ tsHash }) => {
  return (
    <div>
      Waiting for transaction <strong>{txHash}</strong>
    </div>
  )
}

export default WaitingForTransactionMessage;