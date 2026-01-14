import os, zipfile
ROOT = "AetherStack_AI_Sovereign_OS_vInfinity"
def handover():
    os.makedirs(ROOT, exist_ok=True)
    dirs = ['app', 'components', 'hooks', 'docs', 'scripts', 'public', 'state']
    with zipfile.ZipFile(f"{ROOT}_Handover.zip", 'w', zipfile.ZIP_DEFLATED) as z:
        for folder in dirs:
            for root, _, fns in os.walk(folder):
                for fn in fns:
                    z.write(os.path.join(root, fn))
    print(f"?? MASTER HANDOVER COMPLETE: {ROOT}_Handover.zip")
if __name__ == '__main__': handover()
