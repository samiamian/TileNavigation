import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'TileNavigationWebPartStrings';
import TileNavigation from './components/TileNavigation';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

import { ITileNavigationProps } from './components/ITileNavigationProps';
import { IPromotedListLists } from "../model/dataTypes";

import tcs from '../services/tileService';


export default class TileNavigationWebPart extends BaseClientSideWebPart<ITileNavigationProps> {

  private siteLists: IPromotedListLists[];
  private siteListsLoaded: boolean = false;

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ITileNavigationProps> = React.createElement(
      TileNavigation,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        color: this.properties.color,
        setWidth: this.properties.setWidth,
        listName: this.properties.listName,
        tileAnimation: this.properties.tileAnimation,
        context: this.context
      }
    );
    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    if (!this.siteListsLoaded) {

      tcs.getSiteLists(this.context).then((response) => {
        this.siteLists = response;
        this.siteListsLoaded = true;
        this.context.propertyPane.refresh();
        this.onDispose();
      });
    }

    return {
      pages: [
        {
          header: {
            description: "Note: Ensure you have atleast one List Called Promoted List with 3 attributes Title, URL & Order in this site."
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                  PropertyPaneDropdown('listName', {
                    label: strings.listNameFieldLabel,
                    options: this.siteLists
                  }),
                  PropertyFieldColorPicker('color', {
                    label: strings.ColorFieldLabel,
                    selectedColor: this.properties.color,
                    onPropertyChange: this.onPropertyPaneFieldChanged,
                    properties: this.properties,
                    disabled: false,
                    debounce: 1000,
                    isHidden: false,
                    alphaSliderHidden: true,
                    style: PropertyFieldColorPickerStyle.Inline,
                    iconName: 'Precipitation',
                    key: 'colorFieldId'
                  }),
                  PropertyPaneDropdown('setWidth', {
                    label: "Tile Width - desktop view only",
                    selectedKey: '151px',
                    options: [
                      { key: '151px', text: '151px' },
                      { key: '49.5%', text: '50% - 2 in a row' },
                      { key: '32.5%', text: '33% - 3 in a row' },
                      { key: '24.5%', text: '25% - 4 in a row' },
                      { key: '19.5%', text: '20% - 5 in a row' }
                    ]
                  }),
                  PropertyPaneToggle('tileAnimation', {
                    label: strings.TileAnimationFieldLabel,
                    onText: 'On',
                    offText: 'Off'
                  }),
              ]
            }
          ]
        }
      ]
    };
  }
}
