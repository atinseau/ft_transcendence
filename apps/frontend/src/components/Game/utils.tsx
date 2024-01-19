// @ts-nocheck

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { showMessage } from './interface';

export function stopGame(elements, Interface, scene, time, player_name)
{
    elements.isRenderingActive = false;
    elements.frozenPosition = elements.ball.position.clone();
    elements.frozenVelocity = elements.ball.physicsImpostor.getLinearVelocity().clone();
    elements.ball.physicsImpostor.physicsBody.velocity.set(0, 0, 0);
    elements.ball.physicsImpostor.physicsBody.angularVelocity.set(0, 0, 0);
    let deltatime = time - new Date().getTime();
    showMessage("please wait 3 sec, browser performance is too low", scene, Interface.advancedTexture, deltatime - 200);
    setTimeout(() => {
        elements.ball.position.copyFrom(elements.frozenPosition);
        if (elements.ball.physicsImpostor != undefined)
            elements.ball.physicsImpostor.setLinearVelocity(elements.frozenVelocity);
        if (player_name.opponent_name != "")
            elements.isRenderingActive = true;
    }, deltatime);
}