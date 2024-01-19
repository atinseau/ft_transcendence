// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import {createGUI} from './interface'
import { setDiffilcultyExpert } from './buttons';

export async function animation_intro(elements, scene, Interface, difficulties, points_game, canvas, player_name)
{
    var animation = new BABYLON.Animation("cameraAnimation", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var betaAnimation = new BABYLON.Animation("cameraBetaAnimation", "beta", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var radiusAnimation = new BABYLON.Animation("cameraRadiusAnimation", "radius", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  
    var textMaterial = new BABYLON.StandardMaterial("textMaterial", scene);
    textMaterial.diffuseColor = new BABYLON.Color3(0, 0.2, 1);
    textMaterial.alpha = 0.8;
  
    var textMaterial2 = new BABYLON.StandardMaterial("textMaterial", scene);
    textMaterial2.diffuseColor = new BABYLON.Color3(0, 0, 0);
    textMaterial2.alpha = 0.9;
    var boxstart = BABYLON.MeshBuilder.CreateBox('wallstart', { width: 8.5, height: 2, depth: 8.5});
    boxstart.position.y = 6.5;
    boxstart.material = textMaterial2;
    var fontData = await (await fetch("https://assets.babylonjs.com/fonts/Kenney Future Regular.json")).json();
    const myText = BABYLON.MeshBuilder.CreateText("myText", "PONG 3D", fontData, {
      size: 1.1,
      resolution: 64, 
      depth: 0.1
    });
    myText.position.y = 6;
    myText.position.x = 4;
    myText.position.z = 0;
    myText.rotation.y = - Math.PI / 2;
    myText.material = textMaterial;
    var myText2 = myText.clone();
    myText2.rotation.y = myText.rotation.y + Math.PI / 2;
    myText2.position.x = 0;
    myText2.position.z = -4;

    var myText3 = myText.clone();
    myText3.rotation.y = myText.rotation.y + Math.PI;
    myText3.position.x = -4;

    var myText4 = myText.clone();
    myText4.rotation.y = myText.rotation.y - Math.PI / 2;
    myText4.position.x = 0;
    myText4.position.z = 4;

    var keys = [];
    keys.push({ frame: 0, value: Math.PI / 2 });
    keys.push({ frame: 75, value: - Math.PI / 2});
    animation.setKeys(keys);
    keys = [];
    keys.push({ frame: 0, value: Math.PI / 4});
    keys.push({ frame: 100, value: Math.PI / 2.3});
    betaAnimation.setKeys(keys);
    keys = [];
    keys.push({ frame: 0, value: 30});
    keys.push({ frame: 100, value: 16});
    radiusAnimation.setKeys(keys);
    const animationGroup = new BABYLON.AnimationGroup("cameraAnimationGroup");
    animationGroup.addTargetedAnimation(animation, elements.camera);
    animationGroup.addTargetedAnimation(betaAnimation, elements.camera);
    animationGroup.addTargetedAnimation(radiusAnimation, elements.camera);
    elements.camera.setTarget(BABYLON.Vector3.Zero());
    animationGroup.play();

    animationGroup.onAnimationGroupEndObservable.addOnce(() => {
    myText.dispose();
    myText2.dispose();
    myText3.dispose();
    myText4.dispose();
    boxstart.dispose();
    createGUI(elements, Interface, scene, difficulties, points_game, player_name);
    if (difficulties.type === 3)
    {
      elements.started = 0;
      setDiffilcultyExpert(difficulties, elements, scene);
    }
});
}