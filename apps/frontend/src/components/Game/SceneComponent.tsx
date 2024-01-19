// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import {createGUI, adjustCanvasAndCamera} from './interface'
import {createScene} from './create_scene'
import {play_management} from './playing';
import { createintroGUI } from './intro_interface';
import useUserContext from '@contexts/UserContext/useUserContext';
import useNotificationContext from '@contexts/NotificationContext/useNotificationContext';
import { stopGame } from './utils';

const Babylon_pong = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); 
  const profile = useUserContext((state) => state.profile);
  const notifcationCtx = useNotificationContext();
  useEffect(() => {
    if (!canvasRef.current || !profile || !profile.username) {
      return;
    }
    const player_name = {
      event: 'username',
      name: profile.username,
      opponent_name: "bot",
    }
    window.CANNON = require('cannon');
    window.earcut = require('earcut');
    const difficulties = {
      type: 2,
      magnitude: 3.5, //vitesse de l'impulsion
      width_barre: 1.6, //largeur de la barre pour le joueur et l'adversaire
      bot_speed: 0.06, //vitesse de deplacement du bot
    }
    
    const points_game = {
      me: 0,
      opponent: 0,
    }
    
    const canvas = canvasRef.current;
    adjustCanvasAndCamera(canvas);
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
    var scene = new BABYLON.Scene(engine);
    const textures = {
        theme: 1,
        texture_wood_wall: new BABYLON.Texture("wooden_diff.jpg", scene),
        texture_wood_ground: new BABYLON.Texture("raw_plank.jpeg", scene),
        texture_wood_back: new BABYLON.Texture("back3.jpg", scene),
        texture_foot_wall: new BABYLON.Texture("pong3d.jpg", scene),
        texture_foot_ground: new BABYLON.Texture("grass.jpg", scene),
        texture_foot_back: new BABYLON.Texture("back15.jpg", scene),
        texture_futur_wall: new BABYLON.Texture("blue.jpeg", scene),
        texture_futur_ground:  new BABYLON.Texture("abstract_ground.jpg", scene),
        texture_futur_back: new BABYLON.Texture("back5.jpg", scene),
        texture_box: new BABYLON.Texture("white_plaster.jpeg", scene),
    }

    const elements = {
      box: BABYLON.MeshBuilder,
      box2: BABYLON.MeshBuilder,
      ball: BABYLON.MeshBuilder,
      frozenVelocity: BABYLON,
      frozenPosition: BABYLON,
      wall_left: BABYLON.MeshBuilder,
      wall_right: BABYLON.MeshBuilder,
      ground: BABYLON.MeshBuilder,
      column: BABYLON.MeshBuilder,
      column1: BABYLON.MeshBuilder,
      column2: BABYLON.MeshBuilder,
      column3: BABYLON.MeshBuilder,
      skybox: BABYLON.MeshBuilder,
      isRenderingActive: false,
      camera: new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(18, 15, -40)),
      light: BABYLON.HemisphericLight,
      light2: BABYLON.HemisphericLight,
      light3: BABYLON.HemisphericLight,
      lightshadow: BABYLON.DirectionalLight,
      textures: textures,
      started: -2,
    }

    const Interface = {
      advancedTexture: GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI'),
      textBlock: new GUI.TextBlock(),
      textBlock1: new GUI.TextBlock(),
      textBlock2: new GUI.TextBlock(),
      textBlock5: new GUI.TextBlock(),
      textBlock6: new GUI.TextBlock(),
      textBlock7: new GUI.TextBlock(),
      restartButton: GUI.Button.CreateSimpleButton('restartButton', 'Play'),
      football_theme: GUI.Button.CreateImageOnlyButton("footballButton", "grass_mini.jpg"),
      wood_theme: GUI.Button.CreateImageOnlyButton("woodButton", "raw_plank.jpeg"),
      futur_theme: GUI.Button.CreateImageOnlyButton("futurButton", "abstract_ground_mini.jpg"),
      playButton: GUI.Button.CreateSimpleButton('restartButton', 'PLAY'),
      difficulties_easy_Button_intro: GUI.Button.CreateSimpleButton('easyButton', 'EASY'),
      difficulties_medium_Button_intro: GUI.Button.CreateSimpleButton('mediumButton', 'MEDIUM'),
      difficulties_expert_Button_intro: GUI.Button.CreateSimpleButton('hardButton', 'EXPERT'),
      football_theme_intro: GUI.Button.CreateImageOnlyButton("footballButton", "grass_mini.jpg"),
      wood_theme_intro: GUI.Button.CreateImageOnlyButton("woodButton", "raw_plank.jpeg"),
      futur_theme_intro: GUI.Button.CreateImageOnlyButton("futurButton", "abstract_ground_mini.jpg"),
      changeModeOrigin: GUI.Button.CreateSimpleButton('ChangeModeOrigin', 'ORIGINAL'),
      changeModeFps: GUI.Button.CreateSimpleButton('ChangeModeFps', 'FPS'),
      difficulties_easy_Button: GUI.Button.CreateSimpleButton('easyButton', 'EASY'),
      difficulties_medium_Button: GUI.Button.CreateSimpleButton('mediumButton', 'MEDIUM'),
      difficulties_expert_Button: GUI.Button.CreateSimpleButton('hardButton', 'EXPERT'),
    }
    createintroGUI(elements, Interface, scene, difficulties, points_game, canvas, player_name);
    
    let boxDirection = "";
    function updateBoxPosition() {
      const step = 0.0012 * (1000 / deltaTime);
      const originalPosition = elements.box.position.clone();
    
      if (boxDirection === "left" && elements.box.position.x >= (-5 + difficulties.width_barre / 2) + step) {
        elements.box.position.x -= step;
      } else if (boxDirection === "right" && elements.box.position.x <= (5 - difficulties.width_barre / 2) - step) {
        elements.box.position.x += step;
      }
    }

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "ArrowUp") {
        boxDirection = "";
      }
    });
    
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        boxDirection = "left";
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        boxDirection = "right";
      }
    });
    
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
      }
    });

    let time = 0;
    let lastime = new Date().getTime() - 35;
    let deltaTime = 0;
    createScene(elements, difficulties, scene, canvas, Interface, points_game).then((scene) => {
      elements.isRenderingActive = false;
      engine.runRenderLoop(function () {
        if (scene) {
          time = new Date().getTime();
          deltaTime = time - lastime;
          lastime = time;
          const currentFPS = 1000 / deltaTime;
          if (currentFPS < 25 && elements.isRenderingActive == true)
          {
            stopGame(elements, Interface, scene, new Date().getTime() + 3000, player_name);
          }
          updateBoxPosition();
          play_management(elements, difficulties, Interface, scene, points_game, player_name);
          scene.render();
        }});
      });
    
    window.addEventListener("resize", function () {
      adjustCanvasAndCamera(canvas);
      if (elements.started >= 0)
        createGUI(elements, Interface, scene, difficulties, points_game, player_name);
      else
        createintroGUI(elements, Interface, scene, difficulties, points_game, canvas, player_name);
      engine.resize();
    });

    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, [profile]);

  return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'black' }}>
  <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
</div>);
};

export default Babylon_pong;