import * as React from 'react';
import styles from './TileNavigation.module.scss';
import { ITileNavigationProps } from './ITileNavigationProps';
import { ITileNavigationStates } from './ITileNavigationStates';

import { escape } from '@microsoft/sp-lodash-subset';
import tcs from '../../services/tileService';
import { Icon, mergeStyles } from '@fluentui/react';

const icon = mergeStyles({
  alignItems: 'center',
  display: 'flex',
  height: 75,
  marginRight: 10,
  justifyContent: 'center',
  fontSize: 18,
  color:'red',
});

export default class TileNavigation extends React.Component<ITileNavigationProps,ITileNavigationStates,{}> {
  constructor(props: ITileNavigationProps){
    super(props);
    this.state = {
      listData: [],
      tileColor:'',
      listNotFound: false,
    };
  }
public componentDidMount(): void {
  this.setState({
    tileColor: tcs.Lighten(this.props.color)
  })
  tcs.getListDate(this.props.context,this.props.listName).then((response) => {
    if (!response ){
      console.log("response is null");
      this.setState({
        listNotFound: true,
      });
    }
    else{
      this.setState({
        listData: response,
        listNotFound: false,
      });
    }
  });
}

public componentDidUpdate(prevProps){
  if(prevProps.color !== this.props.color){
      this.setState({          
          tileColor: tcs.Lighten(this.props.color)
      });
  }//response === undefined || response.length == 0 
  if(!this.state.listNotFound ){
    this.setState({
      listNotFound: true,
    });
  }
}

  public render(): React.ReactElement<ITileNavigationProps> {
    console.log(this.state.listNotFound);
    return (
      <div className={styles.flexContainer}>
          {!this.state.listNotFound && this.state.listData.map(data =>
            <div className={styles.navitem} style={{backgroundColor: `${this.state.tileColor}`,width: `${this.props.setWidth}`}}>
              <div className={styles.overlay} style={{backgroundColor: `${this.props.color}`}}>
                  <a href={data.url} >{escape(data.title)}</a>
              </div>
            </div>
          )}
          {
            this.state.listNotFound && <><Icon iconName="ChromeClose" className={icon}/><div className={icon}>Promoted List Not Found In Current Site.</div></>
          }
      </div>

    );
  }
}
