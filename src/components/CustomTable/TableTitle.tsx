import styles from './index.module.less'

function TableTitle(props: any) {
  const { titleName, titleAction, titleTips } = props;

  return (
    <div className={styles.titleWrapper}>
      <div className={styles.titleLeft}>
        {titleName?<div className={styles.titleName}>{titleName}</div>:null}
        {titleTips?<div className={styles.titleTips}>{titleTips}</div>:null}
      </div>
      
      {titleAction?<div className={styles.titleRight}>{titleAction}</div>:null}
    </div>
  )
}

export default TableTitle;