import os, zipfile, time
ROOT = "AetherStack_AI_Master_vInfinity"
def generate_handover():
    if not os.path.exists(ROOT): os.makedirs(ROOT)
    # Bundle the entire project structure
    dirs = ['app', 'components', 'hooks', 'docs', 'scripts', 'public', 'state']
    ts = time.strftime("%Y%m%d_%H%M%S")
    filename = f"AetherStack_AI_Sovereign_OS_Handover_{ts}.zip"
    
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        for folder in dirs:
            for root, _, fns in os.walk(folder):
                for fn in fns:
                    z.write(os.path.join(root, fn))
    print(f"?? MASTER HANDOVER COMPLETE: {filename}")

if __name__ == '__main__': generate_handover()
