import Phaser from "phaser";
import GamePlay from "./scenes/GamePlay"
import GameOver from "./scenes/GameOver"

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: 32 * 12,
  height: 32 * 12,
  scene: [GamePlay, GameOver]
};

const game = new Phaser.Game(config);
