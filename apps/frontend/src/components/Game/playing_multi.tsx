// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import {createGUI} from './interface_multi'
import {restartScene} from './create_scene_multi'
import { textEndGame } from './buttons';


export function play_management(elements, difficulties, Interface, scene, points_game, start, player_name, socket)
{
  if (elements.ball.position.x < -5) {
    elements.ball.position.x = -4.84
  } 
  if (elements.ball.position.x > 5) {
    elements.ball.position.x = 4.84;
  }
  if (elements.ball.position.y != 0.16) {
    elements.ball.position.y = 0.16;
  }
 if (elements.ball.position.z < elements.box.position.z && elements.ball.position.z > elements.box.position.z - 0.3 && elements.ball.position.x > elements.box.position.x - (difficulties.width_barre / 2) && elements.ball.position.x < elements.box.position.x + (difficulties.width_barre / 2)) {
    elements.ball.position.z = elements.box.position.z + 0.5;
  }
  if (elements.ball.position.z > elements.box2.position.z && elements.ball.position.z < elements.box2.position.z + 0.3 && elements.ball.position.x > elements.box2.position.x - (difficulties.width_barre / 2) && elements.ball.position.x < elements.box2.position.x + (difficulties.width_barre / 2)) {
    elements.ball.position.z = elements.box2.position.z - 0.5;
  }
  if (elements.ball.position.z < -8.5 && elements.isRenderingActive) {
    elements.ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    elements.ball.isVisible = false;
    elements.isRenderingActive = false;
    if (start.player)
    {
      points_game.opponent += 1;
      createGUI(elements, Interface, scene, difficulties, points_game, start, player_name);
      elements.started = 0;
      start.win = false;
      if (points_game.opponent >= 2 || points_game.me >= 2)
      {
        start.points_me = points_game.me;
        start.points_opponent = points_game.opponent;
        socket.emit('start', start);
        if (points_game.me > points_game.opponent)
          textEndGame(Interface, true);
        else
          textEndGame(Interface, false);
        start.points_me = 0;
        start.points_opponent = 0;
        points_game.me = 0;
        points_game.opponent = 0;
      }
      else if (player_name.opponent_name != undefined)
        restartScene(elements, difficulties, Interface.advancedTexture, false, start);
    }
  }
  if (elements.ball.position.z > 8.5 && elements.isRenderingActive) {
    elements.ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    elements.ball.isVisible = false;
    elements.isRenderingActive = false;
    if (start.player)
    {
      points_game.me += 1;
      createGUI(elements, Interface, scene, difficulties, points_game, start, player_name);
      elements.started = 0;
      start.win = true;
      if (points_game.opponent >= 2 || points_game.me >= 2)
      {
          start.points_me = points_game.me;
          start.points_opponent = points_game.opponent;
          socket.emit('start', start);
          if (points_game.me > points_game.opponent)
            textEndGame(Interface, true);
          else
            textEndGame(Interface, false);
          start.points_me = 0;
          start.points_opponent = 0;
          points_game.me = 0;
          points_game.opponent = 0;
      }
      else if (player_name.opponent_name != undefined)
        restartScene(elements, difficulties, Interface.advancedTexture, false, start);
    }
  }
  if (elements.ball.physicsImpostor.getLinearVelocity().length() > 12.5)
  {
    const newLinearVelocity = elements.ball.physicsImpostor.getLinearVelocity().scale(12.5 / elements.ball.physicsImpostor.getLinearVelocity().length());
      elements.ball.physicsImpostor.setLinearVelocity(newLinearVelocity);
  }
}