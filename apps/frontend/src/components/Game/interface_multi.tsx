// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import {restartScene} from './create_scene_multi'
import { change_theme_foot, change_theme_futur, change_theme_wood} from './buttons_multi'
import { ConfigureTextBlocks } from './buttons_multi';

export function createGUI(elements, Interface, scene, difficulties, points_game, start, player_name) {
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;
  const desiredAspectRatio = 16/10;
  let newWidth, newHeight;
  if (currentWidth / currentHeight > desiredAspectRatio) {
      newWidth = currentHeight * desiredAspectRatio;
      newHeight = currentHeight;
  } else {
      newWidth = currentWidth;
      newHeight = currentWidth / desiredAspectRatio;
  }
  if (Interface.restartButton != undefined)
      Interface.restartButton.dispose();
  Interface.restartButton = GUI.Button.CreateSimpleButton('restartButton', 'Play');
  Interface.restartButton.width = (newWidth / 6) + "px";
  Interface.restartButton.height = (newHeight / 15) + "px";
  Interface.restartButton.color = 'white';
  Interface.restartButton.cornerRadius = 20;
  Interface.restartButton.thickness = 2;
  Interface.restartButton.background = '#0d072f';
  Interface.restartButton.alpha = 0.8;
  Interface.restartButton.children[0].color = "#ffffff";
  Interface.restartButton.fontSize = (newWidth / 50) + "px";
  Interface.restartButton.color = "#ffffff";
  Interface.restartButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  Interface.restartButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  Interface.restartButton.top = - (newHeight / 4) + "px";

  if (Interface.changeModeOrigin != undefined)
      Interface.changeModeOrigin.dispose();
  Interface.changeModeOrigin = GUI.Button.CreateSimpleButton('ChangeModeOrigin', 'ORIGINAL');
  Interface.changeModeOrigin.width = (newWidth / 17) + "px";
  Interface.changeModeOrigin.height = (newHeight / 23) + "px";
  Interface.changeModeOrigin.color = 'white';
  Interface.changeModeOrigin.fontSize = (newWidth / 120) + "px";
  Interface.changeModeOrigin.thickness = 1;
  Interface.changeModeOrigin.cornerRadius = 20;
  Interface.changeModeOrigin.background = '#000000';
  Interface.changeModeOrigin.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  Interface.changeModeOrigin.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.changeModeOrigin.top = (newHeight / 50) + "px";
  Interface.changeModeOrigin.left = (newWidth / 20) + "px";

  if (Interface.changeModeFps != undefined)
      Interface.changeModeFps.dispose();
  Interface.changeModeFps = GUI.Button.CreateSimpleButton('ChangeModeFps', 'FPS');
  Interface.changeModeFps.width = (newWidth / 17) + "px";
  Interface.changeModeFps.height = (newHeight / 23) + "px";
  Interface.changeModeFps.color = 'white';
  Interface.changeModeFps.fontSize = (newWidth / 120) + "px";
  Interface.changeModeFps.thickness = 1;
  Interface.changeModeFps.cornerRadius = 20;
  Interface.changeModeFps.background = '#000000';
  Interface.changeModeFps.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  Interface.changeModeFps.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.changeModeFps.top = (newHeight / 50) + "px";
  Interface.changeModeFps.left = - (newWidth / 20) + "px";

  if (Interface.football_theme != undefined)
      Interface.football_theme.dispose();
  Interface.football_theme = GUI.Button.CreateImageOnlyButton("footballButton", "/grass_mini.jpg");
  Interface.football_theme.width = (newHeight / 25) + "px";
  Interface.football_theme.height = (newHeight / 25) + "px";
  Interface.football_theme.cornerRadius = 3;
  Interface.football_theme.image.stretch = GUI.Image.STRETCH_UNIFORM;
  Interface.football_theme.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  Interface.football_theme.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.football_theme.top = (newHeight / 20) + "px";

  if (Interface.wood_theme != undefined)
      Interface.wood_theme.dispose();
  Interface.wood_theme = GUI.Button.CreateImageOnlyButton("woodButton", "/raw_plank.jpeg");
  Interface.wood_theme.width = (newHeight / 25) + "px";
  Interface.wood_theme.height = (newHeight / 25) + "px";
  Interface.wood_theme.cornerRadius = 3;
  Interface.wood_theme.image.stretch = GUI.Image.STRETCH_UNIFORM;
  Interface.wood_theme.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  Interface.wood_theme.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.wood_theme.top = (newHeight / 20) * 2.5 + "px";
  
  if (Interface.futur_theme != undefined)
      Interface.futur_theme.dispose();
  Interface.futur_theme = GUI.Button.CreateImageOnlyButton("futurButton", "/abstract_ground_mini.jpg");
  Interface.futur_theme.width = (newHeight / 25) + "px";
  Interface.futur_theme.height = (newHeight / 25) + "px";
  Interface.futur_theme.cornerRadius = 3;
  Interface.futur_theme.image.stretch = GUI.Image.STRETCH_UNIFORM;
  Interface.futur_theme.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  Interface.futur_theme.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.futur_theme.top = (newHeight / 20) * 4 + "px";

  ConfigureTextBlocks(Interface, points_game, newHeight, newWidth, player_name);

  Interface.wood_theme.onPointerClickObservable.add(() => {
    change_theme_wood(elements, scene);
  });

  Interface.football_theme.onPointerClickObservable.add(() => {
    change_theme_foot(elements, scene);
  });

  Interface.futur_theme.onPointerClickObservable.add(() => {
    change_theme_futur(elements, scene);
  });

  Interface.changeModeOrigin.onPointerClickObservable.add(() => {
  elements.camera.position = new BABYLON.Vector3(0, 20, 0);
  elements.lightshadow.intensity = 0.15;
  elements.camera.alpha = -Math.PI;
  elements.light.intensity = 0.11;
  elements.light2.intensity = 0.11;
  elements.light3.intensity = 0.11;
  });

  Interface.changeModeFps.onPointerClickObservable.add(() => {
  elements.camera.position = new BABYLON.Vector3(0, 3.25, -15.657);
  elements.lightshadow.intensity = 2;
  elements.light.intensity = 0.5;
  elements.light2.intensity = 0.5;
  elements.light3.intensity = 0.5;
  });

  Interface.restartButton.onPointerClickObservable.add(() => {
    if (elements.started < 1)
    {
      start.player = true;
      start.go = 0;
      restartScene(elements, difficulties, Interface.advancedTexture, true, start);
      elements.started = 1;
      Interface.restartButton.dispose();
    }
    });
  if (Interface.wait != undefined)
    Interface.wait.dispose();
  if (player_name.opponent_name == "")
  {
    points_game.me = 0;
    points_game.opponent = 0;
    Interface.wait = GUI.Button.CreateSimpleButton('wait', "PLEASE WAIT FOR OPPONENT ..");
    Interface.wait.width = (newWidth / 1.2) + "px";
    Interface.wait.height = (newHeight / 2) + "px";
    Interface.wait.color = 'white';
    Interface.wait.cornerRadius = 20;
    Interface.wait.thickness = 2;
    Interface.wait.fontSize = (newWidth / 30) + "px";
    Interface.wait.background = '#0d072f';
    Interface.wait.alpha = 0.7;
    Interface.wait.color = "#ffffff";
    Interface.wait.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    Interface.wait.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Interface.advancedTexture.addControl(Interface.wait);
  }

  if (elements.started < 1 && player_name.opponent_name != "")
    Interface.advancedTexture.addControl(Interface.restartButton);
  Interface.advancedTexture.addControl(Interface.changeModeOrigin);
  Interface.advancedTexture.addControl(Interface.changeModeFps);
  Interface.advancedTexture.addControl(Interface.football_theme);
  Interface.advancedTexture.addControl(Interface.wood_theme);
  Interface.advancedTexture.addControl(Interface.futur_theme);
}

