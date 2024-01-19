// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import {createGUI } from './interface'
import {restartScene} from './create_scene'

export function play_management(elements, difficulties, Interface, scene, points_game, player_name)
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
 if (elements.ball.position.z < elements.box.position.z + 0.2 && elements.ball.position.z > elements.box.position.z - 0.1 && elements.ball.position.x > elements.box.position.x - (difficulties.width_barre / 2) && elements.ball.position.x < elements.box.position.x + (difficulties.width_barre / 2)) {
    elements.ball.position.z = elements.box.position.z + 0.5;
  }
  if (elements.ball.position.z > elements.box2.position.z - 0.2 && elements.ball.position.z < elements.box2.position.z + 0.1 && elements.ball.position.x > elements.box2.position.x - (difficulties.width_barre / 2) && elements.ball.position.x < elements.box2.position.x + (difficulties.width_barre / 2)) {
    elements.ball.position.z = elements.box2.position.z - 0.5;
  }
  if (elements.ball.position.z < -8.5 && elements.isRenderingActive) {
    elements.ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    elements.ball.isVisible = false;
    elements.isRenderingActive = false;
    //showMessage('You lose !', scene, Interface.advancedTexture);
    points_game.opponent += 1;
    createGUI(elements, Interface, scene, difficulties, points_game, player_name);
    restartScene(elements, difficulties, Interface);
  }
  if (elements.ball.position.z > 8.5 && elements.isRenderingActive) {
    elements.ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    elements.ball.isVisible = false;
    elements.isRenderingActive = false;
    //showMessage('You Win !', scene, Interface.advancedTexture);
    points_game.me += 1;
    createGUI(elements, Interface, scene, difficulties, points_game, player_name);
    restartScene(elements, difficulties, Interface);
  }
  if (elements.ball.physicsImpostor.getLinearVelocity().length() > 12.5)
  {
    const newLinearVelocity = elements.ball.physicsImpostor.getLinearVelocity().scale(12.5 / elements.ball.physicsImpostor.getLinearVelocity().length());
      elements.ball.physicsImpostor.setLinearVelocity(newLinearVelocity);
  }
  if (elements.box2.position.x > elements.ball.position.x && elements.box2.position.x >= (-5 + difficulties.width_barre / 2 + difficulties.bot_speed) && elements.isRenderingActive) {
      elements.box2.position.x -= difficulties.bot_speed;
  }
  if (elements.box2.position.x < elements.ball.position.x && elements.box2.position.x <= (5 - difficulties.width_barre / 2 - difficulties.bot_speed) && elements.isRenderingActive) {
      elements.box2.position.x += difficulties.bot_speed;
  }
}