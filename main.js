'use strict';



import { Game } from "./imports/import.js"


document.getElementsByTagName("body")[0].style.cursor = "none";
const game = new Game(this)
const perfectFrameTime = 1000 / 60;
var fps = 0
let deltaTime = 0;
let lastTimestamp = 0;
let lastFrameMenu = true

let msPrev = window.performance.now()
const targetFPS = 60
const msPerFrame = 1000 / targetFPS

const saveTabEl = document.getElementById("tab-bg-closer")
let open_savetab = false;
saveTabEl.onclick = () => { saveTabEl.style.display = "none" }
document.getElementById("save-manager-tab").onclick = (e) => { e.stopPropagation() }
document.getElementById("btn_load_textinput").onclick = () => {
    game.storage.load(document.getElementById("save_textinput").value || true)
}
document.getElementById("btn_load_lastSave").onclick = () => {
    game.storage.load()
}

async function startGame() {
    if (localStorage) { game.storage.accessible = false } else { game.storage.accessible = true }
    game.storage.check()
    requestAnimationFrame(tick);

    //game.autoDebug()
    //while (true) {
    //game.updateGame();

    //}
}

async function tick() {

    requestAnimationFrame(tick);

    const msNow = window.performance.now()
    const msPassed = msNow - msPrev

    if (msPassed < msPerFrame) return

    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime

    FPSCalc()
    game.audio.songMuteBrains()

    //currentTime = Date.now();



    if (game.debug.lag) { await sleep(Math.random() * 100) }


    //console.log("frame")


    var now = Date.now()
    deltaTime = (Date.now() - lastTimestamp) / perfectFrameTime;
    lastTimestamp = Date.now();

    game.gameDisplayer.drawGameFrame();
    if (game.debug.playerHitbox) {
        game.player.drawHitbox()
    }



    if (game.debug.mapBuilder) {
        game.mapEdit.drawHitbox()
    }
    var DrawTime = Date.now() - now
    var now = Date.now()
    if (game.menu.check) {
        updateGame();
        if (lastFrameMenu) {
            game.audio.menuSound()
            game.audio.playSound()
            game.audio.playSongLoop()
            lastFrameMenu = false
            game.gameDisplayer.targetR = 167
            game.gameDisplayer.targetG = 167
            game.gameDisplayer.targetB = 167
        }
    } else {
        game.menu.drawMenu()
        if (game.keyManager.wasKeyJustPressed("KeyW") && !game.menu.checkDos) {
            game.menu.fade()
        }
    }/**/
    //game.audio.playSound()
    game.keyManager.update();
    //console.log("Drawing :", DrawTime , "|||  Updating :", Date.now() - now, "|||  Max : 16 :", DrawTime + Date.now() - now, "|||  Delta Time :", deltaTime)
    //lastTime = Date.now()
    //await sleep(1000/60);

    if (game.keyManager.wasKeyJustPressed("KeyO")) {
        if (!open_savetab) {
            saveTabEl.style.display = "block"
            if(window.localStorage.getItem("game_lastSave")){
                document.getElementById("lastSave-info").innerHTML = "Last Save on: <br>"+window.localStorage.getItem("game_lastSaveTime")
            } else {
                document.getElementById("lastSave-info").innerHTML = "No last save present."
            }
            open_savetab = true
        } else {
            saveTabEl.style.display = "none"
            open_savetab = false
        }
    }

}

async function updateGame() {

    for (let i = 0; i < game.player.orb.length; i++) {
        game.player.orb[i].update()
    }

    game.camera.update(deltaTime)
    game.map.sign.update(game.player, game.keyManager)
    game.player.update(deltaTime);
    for (let i = 0; i < game.enemy.value.length; i++) {
        game.enemy.value[i].update();

    }

    game.debug.update();

    if (game.debug.mapBuilder) {
        game.mapEdit.update();
    }


    game.hook.update(deltaTime);
    game.hookII.update(deltaTime);
    game.storage.update()
    DeltaTime()


    if (game.keyManager.wasKeyJustPressed("KeyP") && game.menu.checkDos) {
        game.menu.fade("up")
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function DeltaTime() {

}

async function FPSCalc() {
    fps++
    await sleep(1000)
    fps--
    game.debug.fpsCount = fps
}

startGame();

