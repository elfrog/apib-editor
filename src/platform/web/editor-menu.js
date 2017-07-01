import React from 'react';
import { MdInsertDriveFile, MdFolderOpen, MdFileDownload, MdUndo, MdRedo, MdHome, MdSettings } from 'react-icons/md';

export const EDITOR_MENU = [
  {
    label: <MdInsertDriveFile />,
    command: 'newDocument' 
  },
  {
    label: <MdFolderOpen />,
    command: 'openFile'
  },
  {
    label: <MdFileDownload />,
    command: 'saveFile'
  },
  null,
  {
    label: <MdUndo />,
    command: 'undo'
  },
  {
    label: <MdRedo />,
    command: 'redo'
  },
  null,
  {
    label: <MdSettings />,
    command: 'showSettingsView'
  },
  {
    label: <MdHome />,
    command: 'showStartPage'
  }
];
