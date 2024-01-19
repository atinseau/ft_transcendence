// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import {restartScene} from './create_scene'
import {setDiffilcultyEasy, setDiffilcultyMedium, setDiffilcultyExpert,
change_theme_foot, change_theme_futur, change_theme_wood, ConfigureTextBlocks} from './buttons'

export function createGUI(elements, Interface, scene, difficulties, points_game, player_name) {
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;
  const desiredAspectRatio = 16/10;
  // Calculez la largeur et la hauteur appropriées en maintenant le rapport d'aspect
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
  Interface.football_theme = GUI.Button.CreateImageOnlyButton("footballButton", "grass_mini.jpg");
  Interface.football_theme.width = (newHeight / 25) + "px";
  Interface.football_theme.height = (newHeight / 25) + "px";
  Interface.football_theme.cornerRadius = 3;
  Interface.football_theme.image.stretch = GUI.Image.STRETCH_UNIFORM;
  Interface.football_theme.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  Interface.football_theme.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.football_theme.top = (newHeight / 20) + "px";

  if (Interface.wood_theme != undefined)
      Interface.wood_theme.dispose();
  Interface.wood_theme = GUI.Button.CreateImageOnlyButton("woodButton", "raw_plank.jpeg");
  Interface.wood_theme.width = (newHeight / 25) + "px";
  Interface.wood_theme.height = (newHeight / 25) + "px";
  Interface.wood_theme.cornerRadius = 3;
  Interface.wood_theme.image.stretch = GUI.Image.STRETCH_UNIFORM;
  Interface.wood_theme.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  Interface.wood_theme.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.wood_theme.top = (newHeight / 20) * 2.5 + "px";
  
  if (Interface.futur_theme != undefined)
      Interface.futur_theme.dispose();
  Interface.futur_theme = GUI.Button.CreateImageOnlyButton("futurButton", "abstract_ground_mini.jpg");
  Interface.futur_theme.width = (newHeight / 25) + "px";
  Interface.futur_theme.height = (newHeight / 25) + "px";
  Interface.futur_theme.cornerRadius = 3;
  Interface.futur_theme.image.stretch = GUI.Image.STRETCH_UNIFORM;
  Interface.futur_theme.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  Interface.futur_theme.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.futur_theme.top = (newHeight / 20) * 4 + "px";

  if (Interface.difficulties_easy_Button != undefined)
      Interface.difficulties_easy_Button.dispose();
  Interface.difficulties_easy_Button = GUI.Button.CreateSimpleButton('easyButton', 'EASY');
  Interface.difficulties_easy_Button.width = (newWidth / 20) + "px";
  Interface.difficulties_easy_Button.height = (newHeight / 22) + "px";
  Interface.difficulties_easy_Button.cornerRadius = 5;
  if (difficulties.type === 1)
      Interface.difficulties_easy_Button.color = 'white';
  else
      Interface.difficulties_easy_Button.color = 'grey';
  Interface.difficulties_easy_Button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  Interface.difficulties_easy_Button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.difficulties_easy_Button.top = (newHeight / 20) + "px";
  Interface.difficulties_easy_Button.fontSize = (newWidth / 100) + "px";

  if (Interface.difficulties_medium_Button != undefined)
      Interface.difficulties_medium_Button.dispose();
  Interface.difficulties_medium_Button = GUI.Button.CreateSimpleButton('mediumButton', 'MEDIUM');
  Interface.difficulties_medium_Button.width = (newWidth / 20) + "px";
  Interface.difficulties_medium_Button.height = (newHeight / 22) + "px";
  Interface.difficulties_medium_Button.cornerRadius = 5;
  if (difficulties.type === 2)
      Interface.difficulties_medium_Button.color = 'white';
  else
      Interface.difficulties_medium_Button.color = 'grey';
  Interface.difficulties_medium_Button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  Interface.difficulties_medium_Button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.difficulties_medium_Button.top = (newHeight / 20) * 2.5 + "px";
  Interface.difficulties_medium_Button.fontSize = (newWidth / 100) + "px";

  if (Interface.difficulties_expert_Button != undefined)
      Interface.difficulties_expert_Button.dispose();
  Interface.difficulties_expert_Button = GUI.Button.CreateSimpleButton('hardButton', 'EXPERT');
  Interface.difficulties_expert_Button.width = (newWidth / 20) + "px";
  Interface.difficulties_expert_Button.height = (newHeight / 22) + "px";
  Interface.difficulties_expert_Button.cornerRadius = 5;
  if (difficulties.type === 3)
      Interface.difficulties_expert_Button.color = 'white';
  else
      Interface.difficulties_expert_Button.color = 'grey';
  Interface.difficulties_expert_Button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  Interface.difficulties_expert_Button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  Interface.difficulties_expert_Button.top = (newHeight / 20) * 4 + "px";
  Interface.difficulties_expert_Button.fontSize = (newWidth / 100) + "px";

  ConfigureTextBlocks(Interface, points_game, newHeight, newWidth, player_name)
  Interface.difficulties_easy_Button.onPointerClickObservable.add(() => {
    if (elements.isRenderingActive === false  && difficulties.type != 1) {
      Interface.difficulties_easy_Button.color = 'white';
      Interface.difficulties_expert_Button.color = 'grey';
      Interface.difficulties_medium_Button.color = 'grey';
      if (difficulties.type === 3)
      {
        elements.column.dispose();
        elements.column1.dispose();
        elements.column2.dispose();
        elements.column3.dispose();
      }
      setDiffilcultyEasy(difficulties, elements);
    }
  });

  Interface.difficulties_medium_Button.onPointerClickObservable.add(() => {
    if (elements.isRenderingActive === false  && difficulties.type != 2) {
      Interface.difficulties_easy_Button.color = 'grey';
      Interface.difficulties_expert_Button.color = 'grey';
      Interface.difficulties_medium_Button.color = 'white';
      if (difficulties.type === 3)
      {
        elements.column.dispose();
        elements.column1.dispose();
        elements.column2.dispose();
        elements.column3.dispose();
      }
      setDiffilcultyMedium(difficulties, elements);  
    }
  });

  Interface.difficulties_expert_Button.onPointerClickObservable.add(() => {
    if (elements.isRenderingActive === false && difficulties.type != 3) {
      Interface.difficulties_easy_Button.color = 'grey';
      Interface.difficulties_expert_Button.color = 'white';
      Interface.difficulties_medium_Button.color = 'grey';
      setDiffilcultyExpert(difficulties, elements, scene);
    }
  });
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
      restartScene(elements, difficulties, Interface);
      elements.started += 1;
    }
    });
  Interface.advancedTexture.addControl(Interface.difficulties_expert_Button);
  Interface.advancedTexture.addControl(Interface.difficulties_medium_Button);
  Interface.advancedTexture.addControl(Interface.difficulties_easy_Button);
  if (elements.started < 1)
      Interface.advancedTexture.addControl(Interface.restartButton);
  Interface.advancedTexture.addControl(Interface.changeModeOrigin);
  Interface.advancedTexture.addControl(Interface.changeModeFps);
  Interface.advancedTexture.addControl(Interface.football_theme);
  Interface.advancedTexture.addControl(Interface.wood_theme);
  Interface.advancedTexture.addControl(Interface.futur_theme);
}

export function showMessage(text, scene, advancedTexture, time) {
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
  const message = GUI.Button.CreateSimpleButton('latency', text)
    message.width = (newWidth / 2) + "px";
    message.height = (newHeight / 4) + "px";
    message.color = 'white';
    message.cornerRadius = 20;
    message.thickness = 2;
    message.fontSize = (newWidth / 40) + "px";
    message.background = '#000000';
    message.alpha = 0.7;
    message.color = "#ffffff";
    message.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    message.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    message.isVisible = true;
  advancedTexture.addControl(message);
  setTimeout(function() {
    message.isVisible = false;
  }, time); 
}

export function adjustCanvasAndCamera(canvas) {
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

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
}