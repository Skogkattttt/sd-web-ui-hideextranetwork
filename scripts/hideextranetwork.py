import gradio as gr
from pathlib import Path
from modules import scripts, script_callbacks, shared, sd_hijack
import yaml

try:
    from modules.paths import script_path, extensions_dir
    FILE_DIR = Path(script_path)
    EXT_PATH = Path(extensions_dir)
except ImportError:
    FILE_DIR = Path().absolute()
    EXT_PATH = FILE_DIR.joinpath('extensions')

KEYWORDS_PATH = Path(scripts.basedir()).joinpath('keywords')
STATIC_TEMP_PATH = FILE_DIR.joinpath('tmp')
TEMP_PATH = KEYWORDS_PATH.joinpath('temp')

# Update the hideExtraNetworkPath.txt file
def write_keyword_base_path():
    with open(STATIC_TEMP_PATH.joinpath('hideExtraNetworkPath.txt'), 'w', encoding="utf-8") as f:
        f.write(KEYWORDS_PATH.relative_to(FILE_DIR).as_posix())

csv_files = []
csv_files_with_none = []

# Update the list of CSV keyword files
def update_keyword_files():
    global csv_files, csv_files_with_none
    files = [str(t.relative_to(KEYWORDS_PATH)) for t in KEYWORDS_PATH.glob("*.csv")]
    csv_files = files
    csv_files_with_none = ["None"] + files

write_keyword_base_path()
update_keyword_files()

# Configure UI settings for the extension
def on_ui_settings():
    HIDE_SECTION = ("hide", "Hide ExtraNetwork")
    shared.opts.add_option("hide_keyWordFile", shared.OptionInfo("hide_keywords.csv", "Hide ExtraNetwork Keyword Filename", gr.Dropdown, lambda: {"choices": csv_files_with_none}, refresh=update_keyword_files, section=HIDE_SECTION))
    shared.opts.add_option("hide_active", shared.OptionInfo(True, "Enable Hide ExtraNetwork", section=HIDE_SECTION))

script_callbacks.on_ui_settings(on_ui_settings)

