import React from 'react';

export default function Spinner() {
  return (
    <div style={styles.flexRow}>
      <div className="preloader-wrapper small active">
        <div className="spinner-layer spinner-green">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
      <span style={{ marginLeft: '10px' }}> Carregando...</span>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDiretion: 'row',
    alignItens: 'center',
    justifyContent: 'center',
  },
};
