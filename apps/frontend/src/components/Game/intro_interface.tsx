// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { change_theme_wood, change_theme_foot, change_theme_futur, setDiffilcultyEasy, setDiffilcultyMedium, setDiffilcultyExpert} from './buttons';
import { animation_intro } from './animation';

export function createintroGUI(elements, Interface, scene, difficulties, points_game, canvas, player_name) {
    const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const desiredAspectRatio = 16/9;
      let newWidth, newHeight;
      if (currentWidth / currentHeight > desiredAspectRatio) {
          newWidth = currentHeight * desiredAspectRatio;
          newHeight = currentHeight;
      } else {
          newWidth = currentWidth;
          newHeight = currentWidth / desiredAspectRatio;
      }
    elements.camera.setTarget( new BABYLON.Vector3(-10, 0, -11));
        const cameraAnimation = new BABYLON.Animation('cameraAnimation', 'beta', 12.5, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keys = [];
      keys.push({ frame: 0, value: Math.PI / 3 });
      keys.push({ frame: 70, value: Math.PI / 4});
      keys.push({ frame: 130, value: Math.PI / 3 }); 
        cameraAnimation.setKeys(keys);
        elements.camera.animations.push(cameraAnimation);
    scene.beginAnimation(elements.camera, 0, 130 , true);

    if (Interface.playButton != undefined)
        Interface.playButton.dispose();
    Interface.playButton = GUI.Button.CreateSimpleButton('restartButton', 'START');
    Interface.playButton.width = (newWidth / 12) + "px";
    Interface.playButton.height = (newHeight / 10) + "px";
    Interface.playButton.color = 'white';
    Interface.playButton.fontSize = (newWidth / 70) + "px";
    Interface.playButton.cornerRadius = 10;
    Interface.playButton.thickness = 4; 
    Interface.playButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    Interface.playButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Interface.playButton.top = -(newHeight / 10) + "px";
    Interface.playButton.left = -(newWidth / 12) + "px";

    if (Interface.difficulties_easy_Button_intro != undefined)
        Interface.difficulties_easy_Button_intro.dispose();
    Interface.difficulties_easy_Button_intro = GUI.Button.CreateSimpleButton('easyButton', 'EASY');
    Interface.difficulties_easy_Button_intro.width = (newWidth / 15) + "px";
    Interface.difficulties_easy_Button_intro.height = (newHeight / 17) + "px";
    Interface.difficulties_easy_Button_intro.cornerRadius = 3;
    if (difficulties.type === 1)
        Interface.difficulties_easy_Button_intro.color = 'white';
    else
        Interface.difficulties_easy_Button_intro.color = 'grey';
    Interface.difficulties_easy_Button_intro.fontSize = (newWidth / 100) + "px";
    Interface.difficulties_easy_Button_intro.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    Interface.difficulties_easy_Button_intro.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Interface.difficulties_easy_Button_intro.top = (newHeight / 20) + "px";
    Interface.difficulties_easy_Button_intro.left = -(newWidth / 12) + "px";

    if (Interface.difficulties_medium_Button_intro != undefined)
        Interface.difficulties_medium_Button_intro.dispose();
    Interface.difficulties_medium_Button_intro = GUI.Button.CreateSimpleButton('mediumButton', 'MEDIUM');
    Interface.difficulties_medium_Button_intro.width = (newWidth / 15) + "px";
    Interface.difficulties_medium_Button_intro.height = (newHeight / 17) + "px";
    Interface.difficulties_medium_Button_intro.cornerRadius = 3;
    if (difficulties.type === 2)
        Interface.difficulties_medium_Button_intro.color = 'white';
    else
        Interface.difficulties_medium_Button_intro.color = 'grey';
    Interface.difficulties_medium_Button_intro.fontSize = (newWidth / 100) + "px";
    Interface.difficulties_medium_Button_intro.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    Interface.difficulties_medium_Button_intro.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Interface.difficulties_medium_Button_intro.top = (newHeight / 20) * 2.5 + "px";
    Interface.difficulties_medium_Button_intro.left = -(newWidth / 12) + "px";

    if (Interface.difficulties_expert_Button_intro != undefined)
        Interface.difficulties_expert_Button_intro.dispose();
    Interface.difficulties_expert_Button_intro = GUI.Button.CreateSimpleButton('hardButton', 'EXPERT');
    Interface.difficulties_expert_Button_intro.width = (newWidth / 15) + "px";
    Interface.difficulties_expert_Button_intro.height = (newHeight / 17) + "px";
    Interface.difficulties_expert_Button_intro.cornerRadius = 3;
    if (difficulties.type === 3)
        Interface.difficulties_expert_Button_intro.color = 'white';
    else
        Interface.difficulties_expert_Button_intro.color = 'grey';
    Interface.difficulties_expert_Button_intro.fontSize = (newWidth / 100) + "px";
    Interface.difficulties_expert_Button_intro.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    Interface.difficulties_expert_Button_intro.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Interface.difficulties_expert_Button_intro.top = (newHeight / 20) * 4 + "px";
    Interface.difficulties_expert_Button_intro.left = -(newWidth / 12) + "px";
      
    
    if (Interface.football_theme_intro != undefined)
        Interface.football_theme_intro.dispose();
    Interface.football_theme_intro = GUI.Button.CreateImageOnlyButton("footballButton", "grass_mini.jpg");
    Interface.football_theme_intro.width = (newWidth / 16) + "px";
    Interface.football_theme_intro.height = (newHeight / 9) + "px";
    Interface.football_theme_intro.thickness = (newWidth / 200);
    Interface.football_theme_intro.cornerRadius = 3;
    if (elements.textures.theme === 2)
        Interface.football_theme_intro.color = 'white';
    else
        Interface.football_theme_intro.color = 'black';
    Interface.football_theme_intro.image.stretch = GUI.Image.STRETCH_UNIFORM;
    Interface.football_theme_intro.left = (- newWidth / 3) + "px";
    Interface.football_theme_intro.top = ((- newHeight / 4)) + "px";

    if (Interface.wood_theme_intro != undefined)
        Interface.wood_theme_intro.dispose();
    Interface.wood_theme_intro = GUI.Button.CreateImageOnlyButton("woodButton", "raw_plank.jpeg");
    Interface.wood_theme_intro.width = (newWidth / 16) + "px";
    Interface.wood_theme_intro.height = (newHeight / 9) + "px";
    Interface.wood_theme_intro.thickness = (newWidth / 200);
    Interface.wood_theme_intro.cornerRadius = 3;
    if (elements.textures.theme === 3)
        Interface.wood_theme_intro.color = 'white';
    else
        Interface.wood_theme_intro.color = 'black';
    Interface.wood_theme_intro.image.stretch = GUI.Image.STRETCH_UNIFORM;
    Interface.wood_theme_intro.left =  (- newWidth / 3) + "px";
    Interface.wood_theme_intro.top =  0 + "px"

    if (Interface.futur_theme_intro != undefined)
        Interface.futur_theme_intro.dispose();
    Interface.futur_theme_intro = GUI.Button.CreateImageOnlyButton("futurButton", "abstract_ground_mini.jpg");
    Interface.futur_theme_intro.width = (newWidth / 16) + "px";
    Interface.futur_theme_intro.height = (newHeight / 9) + "px";
    Interface.futur_theme_intro.thickness = (newWidth / 200);
    Interface.futur_theme_intro.cornerRadius = 3;
    if (elements.textures.theme === 1)
        Interface.futur_theme_intro.color = 'white';
    else
        Interface.futur_theme_intro.color = 'black';
    Interface.futur_theme_intro.image.stretch = GUI.Image.STRETCH_UNIFORM;
    Interface.futur_theme_intro.left = (- newWidth / 3) + "px";
    Interface.futur_theme_intro.top = (newHeight / 4) + "px";

    Interface.wood_theme_intro.onPointerClickObservable.add(() => {
        elements.textures.theme = 3;
        Interface.futur_theme_intro.color = 'black';
        Interface.football_theme_intro.color = 'black';
        Interface.wood_theme_intro.color = 'white';
        change_theme_wood(elements, scene);
    });

    Interface.football_theme_intro.onPointerClickObservable.add(() => {
        elements.textures.theme = 2;
        Interface.futur_theme_intro.color = 'black';
        Interface.football_theme_intro.color = 'white';
        Interface.wood_theme_intro.color = 'black';
        change_theme_foot(elements, scene);
    });

    Interface.futur_theme_intro.onPointerClickObservable.add(() => {
        Interface.futur_theme_intro.color = 'white';
        Interface.football_theme_intro.color = 'black';
        Interface.wood_theme_intro.color = 'black';
        elements.textures.theme = 1;
        change_theme_futur(elements, scene);
    });

    Interface.playButton.onPointerClickObservable.add(() => {
        elements.camera.animations = []; // Supprime toutes les animations de la caméra
        scene.stopAnimation(elements.camera);
        const start = new BABYLON.Sound("start", "scifi.wav", scene, () => {
            start.play();
            Interface.playButton.dispose();
            Interface.difficulties_easy_Button_intro.dispose();
            Interface.difficulties_medium_Button_intro.dispose();
            Interface.difficulties_expert_Button_intro.dispose();
            Interface.wood_theme_intro.dispose();
            Interface.football_theme_intro.dispose();
            Interface.futur_theme_intro.dispose();
            elements.skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 140, scene, undefined, BABYLON.Mesh.DOUBLESIDE);
            var background_material= new BABYLON.StandardMaterial("backgroundMaterial", scene);
            if (elements.textures.theme === 1)
                background_material.diffuseTexture = elements.textures.texture_futur_back;
            else if (elements.textures.theme === 2)
                background_material.diffuseTexture = elements.textures.texture_foot_back;
            else
                background_material.diffuseTexture = elements.textures.texture_wood_back;
            elements.skybox.material = background_material;
            animation_intro(elements, scene, Interface, difficulties, points_game, canvas, player_name);
            elements.started = 0;
        });
        
    });
    Interface.difficulties_easy_Button_intro.onPointerClickObservable.add(() => {
        if (elements.isRenderingActive === false  && difficulties.type != 1) {
            Interface.difficulties_easy_Button_intro.color = 'white';
            Interface.difficulties_expert_Button_intro.color = 'grey';
            Interface.difficulties_medium_Button_intro.color = 'grey';
            setDiffilcultyEasy(difficulties, elements);
        }
    });
      
    Interface.difficulties_medium_Button_intro.onPointerClickObservable.add(() => {
        if (elements.isRenderingActive === false  && difficulties.type != 2) {
            Interface.difficulties_easy_Button_intro.color = 'grey';
            Interface.difficulties_expert_Button_intro.color = 'grey';
            Interface.difficulties_medium_Button_intro.color = 'white';
            setDiffilcultyMedium(difficulties, elements);  
        }
    });
      
    Interface.difficulties_expert_Button_intro.onPointerClickObservable.add(() => {
        if (elements.isRenderingActive === false && difficulties.type != 3) {
            Interface.difficulties_easy_Button_intro.color = 'grey';
            Interface.difficulties_expert_Button_intro.color = 'white';
            Interface.difficulties_medium_Button_intro.color = 'grey';
            setDiffilcultyExpert(difficulties, elements, scene);
        }
    });
    if (Interface.playButton != undefined && Interface.advancedTexture != undefined)
        Interface.advancedTexture.addControl(Interface.playButton);
    Interface.advancedTexture.addControl(Interface.difficulties_expert_Button_intro);
    Interface.advancedTexture.addControl(Interface.difficulties_medium_Button_intro);
    Interface.advancedTexture.addControl(Interface.difficulties_easy_Button_intro);
    Interface.advancedTexture.addControl(Interface.football_theme_intro);
    Interface.advancedTexture.addControl(Interface.wood_theme_intro);
    Interface.advancedTexture.addControl(Interface.futur_theme_intro);
}