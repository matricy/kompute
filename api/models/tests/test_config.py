import pytest
from pydantic import ValidationError

from models.config import Config


def test_parse_empty_config() -> None:
    json_str = """
    {
      "schema_version": 1,
      "clusters": [],
      "cloud_accounts": []
    }
    """
    config = Config.model_validate_json(json_str)
    assert config.schema_version == 1
    assert config.clusters == []
    assert config.cloud_accounts == []


def test_parse_populated_config() -> None:
    json_str = """
    {
      "schema_version": 1,
      "cloud_accounts": [
        {
          "id": "acc_hetzner_7f3a2c",
          "provider": "hetzner",
          "keyring_ref": "cloud:acc_hetzner_7f3a2c"
        }
      ],
      "clusters": [
        {
          "id": "cl_home_lab",
          "name": "home-lab",
          "provider": "hetzner",
          "cloud_account_id": "acc_hetzner_7f3a2c",
          "kubeconfig_path": "kubeconfigs/cl_home_lab.yaml",
          "ssh_key_path": "ssh/cl_home_lab",
          "node_token_keyring_ref": "cluster:cl_home_lab:node_token",
          "created_at": "2026-04-13T14:32:08.123456Z"
        }
      ]
    }
    """
    config = Config.model_validate_json(json_str)
    assert config.schema_version == 1
    assert len(config.cloud_accounts) == 1
    assert config.cloud_accounts[0].provider == "hetzner"
    assert len(config.clusters) == 1
    assert config.clusters[0].cloud_account_id == "acc_hetzner_7f3a2c"
    assert config.clusters[0].name == "home-lab"


def test_rejects_unknown_fields() -> None:
    json_str = """
    {
      "schema_version": 1,
      "clusters": [],
      "cloud_accounts": [],
      "unexpected_field": "oops"
    }
    """
    with pytest.raises(ValidationError):
        Config.model_validate_json(json_str)
