from pathlib import Path

from models.config import Config

CONFIG_DIR = Path.home() / ".kompute"
CONFIG_FILE = CONFIG_DIR / "config.json"
KUBECONFIG_DIR = CONFIG_DIR / "kubeconfigs"
SSH_DIR = CONFIG_DIR / "ssh"


def load_config() -> Config:
    if not CONFIG_FILE.exists():
        CONFIG_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
        config = Config().model_dump_json(indent=2)
        CONFIG_FILE.write_text(config)
    return Config.model_validate_json(CONFIG_FILE.read_text())


def save_config(config: Config) -> None:
    CONFIG_FILE.write_text(config.model_dump_json(indent=2))
