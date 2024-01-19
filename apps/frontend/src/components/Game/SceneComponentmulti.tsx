// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import {createGUI } from './interface_multi'
import {createScene, restartScene} from './create_scene_multi'
import {play_management} from './playing_multi';
import { adjustCanvasAndCamera } from './interface';
import socket from '../../utils/socket';
import useUserContext from '@contexts/UserContext/useUserContext';
import { textEndGame } from './buttons';
import { stopGame } from './utils';
import { createUrl } from '@utils';


const Babylon_pong_multi = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const profile = useUserContext((state) => state.profile);
 
  useEffect(() => {
    if (!canvasRef.current || !profile || !profile.username) {
      return;
    }
    
    const player_name = {
      event: 'username',
      name: profile.username,
      userid: profile.id,
      opponent_name: "",
      opponent_id: "",
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
    
    const stop = {
      event: 'stop',
      date: 0,
    }

    const start = {
      event: 'start',
      date: 0,
      player: true,
      go: 0,
      win: undefined,
      points_me: 0,
      points_opponent: 0,
    };
    
    const position = {
      event: 'position',
      ball_x: 0, 
      ball_z: 0,
      barre_x: 0,
      barre_z: 0,
    };
    const position_opponent = {
      type: 'position',
      ball_x: 0,
      ball_z: 0,
      barre_x: 0,
      barre_z: -7,
    };
    
    const username = {
      event: 'username',
      username: player_name.name,
      userId: profile.id,
    };

    socket.on('connect', () => {
      console.log('Connecté au serveur WebSocket');
    });
  
    socket.emit('username', username);

    socket.on('opponent', (message) => {
      player_name.opponent_name = message.opponent_name;
      player_name.opponent_id = message.opponent_id;
      if (player_name.opponent_name == "")
      {
          elements.ball.isVisible = false;
          if (elements.isRenderingActive)
            elements.ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          elements.ball.position.x = 0;
          elements.ball.position.y = 0.16;
          elements.ball.position.z = 0;
          elements.ball.isVisible = true;
          elements.isRenderingActive = false;
          elements.ball.isVisible = true;
        points_game.me = 0;
        points_game.opponent = 0;
        start.points_me = 0;
        start.points_opponent = 0;
      }
      elements.started = 0;
      if (elements.start == 1)
        createGUI(elements, Interface, scene, difficulties, points_game, start, player_name);
      });

      socket.on('stop', (message) => {
        if (elements.isRenderingActive === true)
            stopGame(elements, Interface, scene, message.date, player_name);
      });

    socket.on('position', (message) => {
      position_opponent.ball_x = message.ball_x;
      position_opponent.ball_z = message.ball_z;
      position_opponent.barre_x = message.barre_x;
      position_opponent.barre_z = message.barre_z;
    });

    socket.on('start', (message) => {
      start.go = 1;
      start.date = message.date;
      start.win = message.win;
    });

    socket.on('disconnect', () => {
      console.log('Déconnexion du serveur WebSocket');
    });

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

    const Interface = {
      advancedTexture: GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI'),
      textBlock: new GUI.TextBlock(),
      textBlock1: new GUI.TextBlock(),
      textBlock2: new GUI.TextBlock(),
      textBlock3: new GUI.TextBlock(),
      textBlock4: new GUI.TextBlock(),
      textBlock5: new GUI.TextBlock(),
      textBlock6: new GUI.TextBlock(),
      textBlock7: new GUI.TextBlock(),
      textBlock8: new GUI.TextBlock(),
      wait: GUI.Button.CreateSimpleButton('wait', "PLEASE WAIT FOR OPPONENT .."),
      restartButton: GUI.Button.CreateSimpleButton('restartButton', 'Play'),
      football_theme: GUI.Button.CreateImageOnlyButton("footballButton", "grass_mini.jpg"),
      wood_theme: GUI.Button.CreateImageOnlyButton("woodButton", "raw_plank.jpeg"),
      futur_theme: GUI.Button.CreateImageOnlyButton("futurButton", "abstract_ground_mini.jpg"),
      changeModeOrigin: GUI.Button.CreateSimpleButton('ChangeModeOrigin', 'ORIGINAL'),
      changeModeFps: GUI.Button.CreateSimpleButton('ChangeModeFps', 'FPS'),
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
      camera: new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 3.25, -15.657)),
      light: BABYLON.HemisphericLight,
      light2: BABYLON.HemisphericLight,
      light3: BABYLON.HemisphericLight,
      lightshadow: BABYLON.DirectionalLight,
      textures: textures,
      started: -2,
      start: 0,
    }

    let boxDirection = "";

    function updateBoxPosition() {
      const step = 0.001 * (1000 / deltaTime);
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
    createScene(elements, difficulties, scene, canvas, Interface, points_game, start, player_name).then((scene) => {
      elements.isRenderingActive = false;
      start.go = 0;
      engine.runRenderLoop(function () {
        if (scene) {
          time = new Date().getTime();
          deltaTime = time - lastime;
          lastime = time;
          const currentFPS = 1000 / deltaTime;
          if (currentFPS < 25 && elements.isRenderingActive == true)
          {
            stop.date = new Date().getTime() + 3000;
            socket.emit('stop', stop);
            stopGame(elements, Interface, scene, stop.date, player_name);
          }
          if (elements.started === 1)
          {
            start.date = new Date().getTime();
            start.points_me = points_game.me;
            start.points_opponent = points_game.opponent;
            socket.emit('start', start);
            elements.started++;
          }
          if (start.go === 1)
          {
            start.player = false;
            if (start.win === true)
              points_game.me += 1;
            else if (start.win === false)
              points_game.opponent += 1;
            elements.started = 1;
            createGUI(elements, Interface, scene, difficulties, points_game, start, player_name);
            if (points_game.opponent >= 2 || points_game.me >= 2)
            {
              if (points_game.me > points_game.opponent)
                textEndGame(Interface, true);
              else
                textEndGame(Interface, false);

              start.points_me = 0;
              start.points_opponent = 0;
              points_game.me = 0;
              points_game.opponent = 0;
            }
            else
              restartScene(elements, difficulties, Interface.advancedTexture, true, start);
            elements.started = 2;
            start.go++;
          }
          if (elements.started === 2 && start.go === 0)
          {
            elements.box2.position.x = -1 * position_opponent.barre_x;
            elements.box2.position.z = -1 * position_opponent.barre_z;
            position.ball_x = elements.ball.position.x;
            position.ball_z = elements.ball.position.z;
            position.barre_x = elements.box.position.x;
            position.barre_z = elements.box.position.z;
            socket.emit('position', position);
          }
          updateBoxPosition();
          play_management(elements, difficulties, Interface, scene, points_game, start, player_name, socket);
          if (elements.started === 2 && start.go === 2)
          {
            elements.ball.position.x = - position_opponent.ball_x;
            elements.ball.position.z = - position_opponent.ball_z;
            elements.box2.position.x = -1 * position_opponent.barre_x;
            elements.box2.position.z = -1 * position_opponent.barre_z;
            position.barre_x = elements.box.position.x;
            position.barre_z = elements.box.position.z;
            socket.emit('position', position);
          }
          scene.render();
        }});
      });
        
    window.addEventListener("resize", function () {
      adjustCanvasAndCamera(canvas);
      createGUI(elements, Interface, scene, difficulties, points_game, start, player_name);
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

export default Babylon_pong_multi;