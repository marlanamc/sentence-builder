with open('src/app/game/level/[id]/page.tsx', 'r') as f:
    lines = f.readlines()

# Fix line 1990 (0-indexed as 1989)
if len(lines) > 1989:
    lines[1989] = lines[1989].replace('%`', '%`')

with open('src/app/game/level/[id]/page.tsx', 'w') as f:
    f.writelines(lines)

print('Fixed template literal in line 1990')
