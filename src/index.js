import Phaser from "phaser";
import GamePlay from "./scenes/GamePlay"
import GameOver from "./scenes/GameOver"

const config = {
  type: Phaser.AUTO,
  width: 32 * 12,
  height: 32 * 12,
  scene: [GamePlay, GameOver]
};

const game = new Phaser.Game(config);
