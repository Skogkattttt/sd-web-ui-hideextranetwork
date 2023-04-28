# Hide Extra Network Extension for Stable Diffusion WebUI
This extension provides functionality to hide specific Extra Network cards in Stable Diffusion WebUI based on keywords provided in a CSV file. Users can easily customize the keywords and enable/disable the extension as needed.

## Features
* Hide Extra Network cards based on keywords from a CSV file
* Enable/disable the Hide Extra Network feature
* Supports multiple keyword files for easy switching
* Automatically updates the list of keyword files when new files are added
## Installation
To install the extension, place the hideextranetwork folder in the extensions directory of your Stable Diffusion WebUI.
## Configuration
The configuration options for this extension can be found in the UI settings under the "Hide Extra Network" section. The available options are:

* Hide Extra Network Keyword Filename: The name of the CSV file containing the keywords to use for hiding Extra Network cards. The file should be placed in the keywords folder of the extension directory. If set to "None", the extension will not hide any cards based on keywords.
* Enable Hide Extra Network: Enable or disable the Hide Extra Network feature. When disabled, the extension will not hide any cards based on keywords.
## Usage
1. Place your CSV keyword files in the keywords folder of the extension directory. The CSV files should contain one keyword per line.
1. In the UI settings, under the "Hide Extra Network" section, select the desired keyword file and enable the Hide Extra Network feature.
1. The extension will automatically hide Extra Network cards that match the keywords provided in the selected CSV file.
