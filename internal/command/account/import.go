package account

import (
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/urfave/cli/v2"

	"github.com/valist-io/valist/internal/command/utils/flags"
	"github.com/valist-io/valist/internal/core/config"
	"github.com/valist-io/valist/internal/prompt"
)

func NewImportCommand() *cli.Command {
	return &cli.Command{
		Name:  "import",
		Usage: "Import an account",
		Flags: []cli.Flag{
			flags.AccountPrivateKey(),
			flags.AccountPassphrase(),
		},
		Action: func(c *cli.Context) error {
			if c.NArg() != 0 {
				cli.ShowSubcommandHelpAndExit(c, 1)
			}

			home, err := os.UserHomeDir()
			if err != nil {
				return err
			}

			cfg := config.NewConfig(home)
			if err := cfg.Load(); err != nil {
				return err
			}

			privkey, err := prompt.AccountPrivateKey().RunFlag(c, "key")
			if err != nil {
				return err
			}

			passphrase, err := prompt.AccountPassphrase().RunFlag(c, "passphrase")
			if err != nil {
				return err
			}

			private, err := crypto.HexToECDSA(privkey)
			if err != nil {
				return err
			}

			account, err := cfg.KeyStore().ImportECDSA(private, passphrase)
			if err != nil {
				return err
			}

			if cfg.Accounts.Default == common.HexToAddress("0x0") {
				cfg.Accounts.Default = account.Address
			}

			fmt.Println("Successfully imported", account.Address)
			return cfg.Save()
		},
	}
}