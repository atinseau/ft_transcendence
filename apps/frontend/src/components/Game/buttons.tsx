// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function setDiffilcultyEasy(difficulties, elements) {
    difficulties.magnitude = 3.5;
    elements.box.scaling.x = 1.2;
    elements.box2.scaling.x = 1.2;
    difficulties.width_barre = 1.92;
    difficulties.bot_speed = 0.04;
    difficulties.type = 1;
  }

export function setDiffilcultyMedium(difficulties, elements) {
    difficulties.magnitude = 3.5;
    elements.box.scaling.x = 1;
    elements.box2.scaling.x = 1;
    difficulties.width_barre = 1.6;
    difficulties.bot_speed = 0.06;
    difficulties.type = 2;
  }
  
export function setDiffilcultyExpert(difficulties, elements, scene) {
    difficulties.magnitude = 3.6;
    elements.box.scaling.x = 0.75;
    elements.box2.scaling.x = 0.75;
    difficulties.width_barre = 0.9;
    difficulties.bot_speed = 0.09;
    difficulties.type = 3;
  
    if (elements.started > -1)
    {
    // **** COLUMN ***
    const material_column = new BABYLON.StandardMaterial("material_column", scene);
    material_column.diffuseTexture = new BABYLON.Texture("synthetic_wood.jpeg", scene);
    material_column.diffuseColor = new BABYLON.Color3(1, 1, 1);
    elements.column = BABYLON.MeshBuilder.CreateCylinder(
      'cylinder', 
      { height: 1, diameterTop: 0.6, diameterBottom: 0.6}, 
      scene
    );
    elements.column.position.x = 1;
    if (elements.started <= -1)
      elements.column.position.y = 0.5;
    else
      elements.column.position.y = 7;
    elements.column.position.z = 0;
    elements.column.material = material_column;
    elements.column.checkCollisions = true;
      
    elements.column1 = elements.column.clone();
    elements.column1.position.x = 2.5;
  
    elements.column2 = elements.column.clone();
    elements.column2.position.x = -1;
  
    elements.column3 = elements.column.clone();
    elements.column3.position.x = -2.5;
    
    
      const animation = new BABYLON.Animation(
      'columnAnimation',
      'position.y',
      30, // Frame per second
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
      const keyFrames = [
        { frame: 0, value: elements.column.position.y },
        { frame: 40, value: elements.column.position.y - 6.5 }
      ];
      animation.setKeys(keyFrames);
      
      elements.column.animations.push(animation);
      elements.column1.animations.push(animation);
      elements.column2.animations.push(animation);
      elements.column3.animations.push(animation);
    
      scene.beginAnimation(elements.column, 0, 40, false);
      scene.beginAnimation(elements.column1, 0, 40, false);
      scene.beginAnimation(elements.column2, 0, 40, false);
      scene.beginAnimation(elements.column3, 0, 40, false);
  
      scene.addMesh(elements.column);
      scene.addMesh(elements.column1);
      scene.addMesh(elements.column2);
      scene.addMesh(elements.column3);
    
      const ballbounce = new BABYLON.Sound("ball", "ball.wav", scene);
      setTimeout(() => {
        elements.column.physicsImpostor = new BABYLON.PhysicsImpostor(elements.column, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1}, scene);
        elements.column1.physicsImpostor = new BABYLON.PhysicsImpostor(elements.column1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1}, scene);
        elements.column2.physicsImpostor = new BABYLON.PhysicsImpostor(elements.column2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1}, scene);
        elements.column3.physicsImpostor = new BABYLON.PhysicsImpostor(elements.column3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1}, scene);
        elements.column.physicsImpostor.registerOnPhysicsCollide(elements.ball.physicsImpostor, function(main, collided) {
          ballbounce.play();
        });
        elements.column1.physicsImpostor.registerOnPhysicsCollide(elements.ball.physicsImpostor, function(main, collided) {
          ballbounce.play();
        });
        elements.column2.physicsImpostor.registerOnPhysicsCollide(elements.ball.physicsImpostor, function(main, collided) {
          ballbounce.play();
        });
        elements.column3.physicsImpostor.registerOnPhysicsCollide(elements.ball.physicsImpostor, function(main, collided) {
          ballbounce.play();
        });
      }, 1500);
    }
  }

const message_count = new GUI.TextBlock();
export function displayCountdown(count, callback, advancedTexture) {  
  message_count.color = "white";
  message_count.fontSize = 150;
  message_count.alpha = 0.7;
  message_count.outlineColor = "white";
  message_count.outlineWidth = 4;
  message_count.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  message_count.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  message_count.isVisible = false;
  advancedTexture.addControl(message_count);
  if (count >= 1) {
    message_count.text = count.toString();
    message_count.isVisible = true;
    setTimeout(function() {
      message_count.isVisible = false;
      displayCountdown(count - 1, callback, advancedTexture);
    }, 1000);
  } else {
    callback();
  }
}

export function change_theme_wood(elements, scene) {
  var material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_wood_ground;;
  elements.ground.material = material;
  material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_wood_wall;
  elements.wall_left.material = material;
  elements.wall_right.material = material;
  material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_wood_back;
  elements.skybox.material = material;
  const texture_box = new BABYLON.Texture("white_plaster.jpeg", scene);
  const material_box = new BABYLON.StandardMaterial("material_box", scene);
  material_box.diffuseTexture = texture_box;
  material_box.diffuseColor = new BABYLON.Color3(0.1, 0.1, 1);
  material_box.specularColor = new BABYLON.Color3(0.1, 0.1, 1);
  material_box.emissiveColor = new BABYLON.Color3(0.1, 0.1, 1);
  elements.box.material = material_box;
  elements.box2.material = material_box;
  const material_ball = new BABYLON.StandardMaterial("materialName", scene);
  material_ball.alpha = 0.95;
  material_ball.diffuseColor = new BABYLON.Color3(0.3, 0, 0.8);
  material_ball.specularColor = new BABYLON.Color3(1, 1, 1);
  material_ball.emissiveColor = new BABYLON.Color3(0.3, 0, 0.8);
  elements.ball.material = material_ball;
}

export function change_theme_foot(elements, scene) {
  var material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_foot_ground;
  elements.ground.material = material;
  material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_foot_wall;
  elements.wall_left.material = material;
  elements.wall_right.material = material;
  material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_foot_back;
  elements.skybox.material = material;
  const texture_box = new BABYLON.Texture("white_plaster.jpeg", scene);
  const material_box = new BABYLON.StandardMaterial("material_box", scene);
  material_box.diffuseTexture = texture_box;
  material_box.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.1);
  material_box.specularColor = new BABYLON.Color3(1, 1, 1);
  material_box.emissiveColor = new BABYLON.Color3(0.6, 0.2, 0.1);
  elements.box.material = material_box;
  elements.box2.material = material_box;
  const material_ball = new BABYLON.StandardMaterial("materialName", scene);
  material_ball.alpha = 0.95;
  material_ball.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
  material_ball.specularColor = new BABYLON.Color3(1, 1, 1);
  material_ball.emissiveColor = new BABYLON.Color3(1, 0.4, 0);
  elements.ball.material = material_ball;
}

export function change_theme_futur(elements, scene) {
  var material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_futur_ground;
  elements.ground.material = material;
  material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_futur_wall;
  elements.wall_left.material = material;
  elements.wall_right.material = material;
  material = new BABYLON.StandardMaterial("material", scene);
  material.diffuseTexture = elements.textures.texture_futur_back;
  elements.skybox.material = material;
  const texture_box = elements.textures.texture_box;;
  const material_box = new BABYLON.StandardMaterial("material_box", scene);
  material_box.diffuseTexture = texture_box;
  material_box.diffuseColor = new BABYLON.Color3(0, 1, 0);
  material_box.specularColor = new BABYLON.Color3(1, 1, 1);
  material_box.emissiveColor = new BABYLON.Color3(0, 1, 0);
  elements.box.material = material_box;
  elements.box2.material = material_box;
  const material_ball = new BABYLON.StandardMaterial("materialName", scene);
  material_ball.alpha = 0.95;
  material_ball.diffuseColor = new BABYLON.Color3(0, 1, 0);
  material_ball.specularColor = new BABYLON.Color3(1, 1, 1);
  material_ball.emissiveColor = new BABYLON.Color3(0, 1, 0);
  elements.ball.material = material_ball;
}

export function ConfigureTextBlocks(Interface, points_game, newHeight, newWidth, player_name) {
  Interface.textBlock6.text = "SOLO GAME";
  Interface.textBlock6.color = "#eaeaea";
  Interface.textBlock6.fontSize = 0.02 * newHeight;
  Interface.textBlock6.top = (- newHeight / 2.1) + "px";
  Interface.textBlock6.left = -(newWidth / 2.7) + "px"
  Interface.textBlock6.fontFamily = "sans-serif";
  if (Interface.textBlock6 != undefined)
      Interface.advancedTexture.addControl(Interface.textBlock6);

  Interface.textBlock2.text = points_game.opponent;
  Interface.textBlock2.color = "#eaeaea";
  Interface.textBlock2.fontSize = 0.05 * newHeight;
  Interface.textBlock2.top = (- newHeight / 2.5) + "px";
  Interface.textBlock2.left = (- newWidth / 4) + "px";
  Interface.textBlock2.outlineColor = "white";
  Interface.textBlock2.outlineWidth = 2;
  Interface.textBlock2.fontFamily = "Arial"; 
  if (Interface.textBlock2 != undefined)
      Interface.advancedTexture.addControl(Interface.textBlock2);

  Interface.textBlock5.text = "PLAYER NAME";
  Interface.textBlock5.color = "#eaeaea";
  Interface.textBlock5.fontSize = 0.02 * newHeight;
  Interface.textBlock5.top = (- newHeight / 2.1) + "px";
  Interface.textBlock5.left = (newWidth / 2.7) + "px";
  Interface.textBlock5.fontFamily = "sans-serif";
  if (Interface.textBlock5 != undefined)
      Interface.advancedTexture.addControl(Interface.textBlock5);
  
  Interface.textBlock1.text = player_name.name;
  Interface.textBlock1.color = "#87b9ff";
  Interface.textBlock1.fontSize = 0.03 * newHeight;
  Interface.textBlock1.top = (- newHeight / 2.3) + "px";
  Interface.textBlock1.left = (newWidth / 2.7) + "px";
  Interface.textBlock1.fontFamily = "Arial"; 
  if (Interface.textBlock1 != undefined && Interface.textBlock1.text != "")
      Interface.advancedTexture.addControl(Interface.textBlock1);
    
  Interface.textBlock.text = points_game.me;
  Interface.textBlock.color = "#eaeaea";
  Interface.textBlock.fontSize = 0.05 * newHeight;
  Interface.textBlock.top = (- newHeight / 2.5) + "px";
  Interface.textBlock.left = (newWidth / 4) + "px";
  Interface.textBlock.outlineColor = "white";
  Interface.textBlock.outlineWidth = 2;
  Interface.textBlock.fontFamily = "Arial";
  if (Interface.textBlock != undefined)
      Interface.advancedTexture.addControl(Interface.textBlock);
}
  
export function textEndGame(Interface, win)
{
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
  if (win == true)
    Interface.wait = GUI.Button.CreateSimpleButton('wait', "YOU WIN");
  else if (win == false)
    Interface.wait = GUI.Button.CreateSimpleButton('wait', "YOU LOSE");
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