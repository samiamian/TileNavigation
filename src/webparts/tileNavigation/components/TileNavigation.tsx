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
      tileColor:'#a34141',
      listNotFound: true,
      listDataNotFound: false,
      listName: '',
    };
  }
public componentDidMount(): void {
  if(this.props.color){
    this.setState({
      tileColor: tcs.Lighten(this.props.color)
    })
  }
  if(this.props.listName){
    this.setState({listName: this.props.listName});

      tcs.getListData(this.props.context,this.props.listName).then((response) => {
        if (!response ){
          this.setState({
            listDataNotFound: true,
            listNotFound: true,
          });
        }
        else{
          this.setState({
            listData: response,
            listNotFound: false,
            listDataNotFound: false,
          });
        }
      });
    }
    else{
      this.setState({
        listNotFound: true,
        listDataNotFound: false,
      });
    }
    console.log("listNotFound :: "+this.state.listNotFound);
    console.log("listDataNotFound :: "+this.state.listDataNotFound);

}

public componentDidUpdate(prevProps){
  if(prevProps.color !== this.props.color){
      this.setState({          
          tileColor: tcs.Lighten(this.props.color)
      });
  }
  if(prevProps.listName !==  this.props.listName){
    this.setState({
      listName:this.props.listName
    });
    if(this.props.listName){
      this.setState({listName: this.props.listName});
  
        tcs.getListData(this.props.context,this.props.listName).then((response) => {
          if (!response ){
            this.setState({
              listDataNotFound: true,
              listNotFound: true,
            });
          }
          else{
            this.setState({
              listData: response,
              listNotFound: false,
              listDataNotFound: false,
            });
          }
        });
      }
      else{
        this.setState({
          listNotFound: true,
          listDataNotFound: false,
        });
      }
      console.log("listNotFound :: "+this.state.listNotFound);
      console.log("listDataNotFound :: "+this.state.listDataNotFound);
  }
}

  public render(): React.ReactElement<ITileNavigationProps> {
    return (
      <div className={styles.flexContainer}>
          {!this.state.listNotFound && this.props.tileAnimation && this.state.listData.map(data =>
            <div className={styles.navitem} style={{backgroundColor: `${this.state.tileColor}`,width: `${this.props.setWidth}`}}>
              <div className={styles.overlay} style={{backgroundColor: `${this.props.color}`}}>
                  <a href={data.url} target="_blank">{escape(data.title)}</a>
              </div>
            </div>
          )}
          {!this.state.listNotFound && !this.props.tileAnimation && this.state.listData.map(data =>
            <div className={styles.navitem} style={{backgroundColor: `${this.state.tileColor}`,width: `${this.props.setWidth}`}}>
              <div className={styles.noAnimationOverlay} style={{backgroundColor: `${this.props.color}`}}>
                  <a href={data.url} target="_blank">{escape(data.title)}</a>
              </div>
            </div>
          )}
          {
            this.state.listNotFound && !this.state.listDataNotFound && <><Icon iconName="ChromeClose" className={icon}/><div className={icon}>Please Select A Valid Promoted List In The Properties Pane.</div></>
          }
          {
            this.state.listDataNotFound && this.state.listNotFound && <><Icon iconName="ChromeClose" className={icon}/><div className={icon}>List does not contain Title, URL & Order Fields.</div></>
          }
      </div>

    );
  }
}
