# ST Mastermind

A standalone NUI Mastermind minigame for FiveM. The player must identify a four-digit code before the timer or available attempts run out.

## Preview

<img width="796" height="651" alt="ST Mastermind minigame" src="https://github.com/user-attachments/assets/131c1448-ac91-4380-820b-5fe933e85383" />

## Author and Support

- Author: `ii_abual3bed | stdev`
- Discord: https://discord.gg/HCskVYZPtB

## Features

- Four-digit code generated with unique digits
- Configurable timer and maximum attempts
- Green, yellow, and red feedback for each submitted digit
- Cyber-security terminal NUI
- Win/loss result screen with automatic close
- Escape-key cancellation
- Lua exports for starting and configuring the game
- Client event containing the final result
- Built-in test command

## How to Play

Enter four digits and submit the attempt:

- **Green:** correct digit in the correct position
- **Yellow:** digit exists but is in the wrong position
- **Red:** digit does not exist in the secret code

The player wins by finding the complete code. The player loses when the timer expires, all attempts are used, or the UI is cancelled.

## Installation

1. Copy `st-mastermind` into your server resources directory.
2. If your server does not use ElectronAC, remove its client include line from `fxmanifest.lua`.
3. Add `ensure st-mastermind` to `server.cfg`.
4. Start this resource before any script that uses its exports.

Example:

```cfg
ensure st-mastermind
ensure st-vendingrobbery
```

## Usage

Start the minigame from a client script:

```lua
exports['st-mastermind']:StartMiniGame()
```

Listen for the result:

```lua
AddEventHandler('st-mastermind:finished', function(success)
    if success then
        print('Mastermind completed successfully')
    else
        print('Mastermind failed or was cancelled')
    end
end)
```

The `success` argument is `true` when the code is solved and `false` when the player loses or cancels.

## Configuration Exports

Set the maximum number of attempts before starting the game:

```lua
exports['st-mastermind']:SetAttempts(6)
```

Set the timer in seconds:

```lua
exports['st-mastermind']:SetTimer(60)
```

Complete example:

```lua
exports['st-mastermind']:SetAttempts(6)
exports['st-mastermind']:SetTimer(60)
exports['st-mastermind']:StartMiniGame()
```

The default values are 10 attempts and 60 seconds. Settings remain active for later games until changed again.

## Test Command

Use this client command in-game to open the minigame with its current settings:

```text
/stg
```

## Integration Notes

- The resource keeps the NUI hidden until `StartMiniGame` is called.
- NUI focus is released automatically three seconds after the result screen appears.
- Stopping the resource releases NUI focus.
- Integration is client-side; listen for `st-mastermind:finished` in the same client context that starts the game.

## License

MIT. See `LICENSE`.
