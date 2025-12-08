import pandas as pd
import xlsxwriter
from datetime import datetime

# --- CONFIGURATION ---
filename = "Developmental_Debt_Audit_Tool.xlsx"
org_name = "Global Governance Frameworks"
website = "globalgovernanceframeworks.org"

# --- DATA PREPARATION ---

# 1. INSTRUCTIONS SHEET CONTENT
instructions_data = {
    "Step": [1, 2, 3, 4],
    "Action": [
        "Identify the Liability",
        "Estimate Annual Costs",
        "Project the 'Cleanup'",
        "Calculate the Total"
    ],
    "Description": [
        "Look at your organization. Where are you rigid (Blue), externalizing costs (Orange), or paralyzed by consensus (Green)? List these in the 'Audit Ledger' tab.",
        "How much do you spend annually to ignore or manage this problem? (Lobbying, PR, turnover, delays, inefficient processes). This is your 'Avoidance Cost'.",
        "If this blows up (regulation, scandal, collapse), what is the estimated cost? Or what is the value of the market you are missing? These are 'Cleanup' and 'Opportunity' costs.",
        "The sheet will automatically sum your Total Developmental Debt. This is the liability sitting off your balance sheet."
    ]
}

# 2. EXAMPLES SHEET CONTENT (To guide the user)
examples_data = [
    ["Blue Debt (Rigidity)", "Legacy IT System maintained to avoid upgrade pain", 500000, 2000000, 5000000, "Technical bankruptcy when system fails"],
    ["Blue Debt (Rigidity)", "HR policies that ignore remote work reality", 300000, 0, 8000000, "Talent exodus; inability to compete"],
    ["Orange Debt (Externalization)", "Supply Chain carbon/human rights risks ignored", 150000, 10000000, 0, "Regulatory fines, brand collapse"],
    ["Orange Debt (Externalization)", "Employee burnout treated as normal", 800000, 5000000, 12000000, "Mass turnover, institutional knowledge loss"],
    ["Green Debt (Paralysis)", "Decision gridlock due to consensus culture", 1200000, 0, 3000000, "Market window closes, competitors move"],
    ["Green Debt (Paralysis)", "Avoiding hard conversations about performance", 400000, 0, 2000000, "Mediocrity becomes culture, A-players leave"],
]

# 3. EMPTY LEDGER STRUCTURE (For the user to fill)
# We create a dataframe with empty rows for them to fill in
ledger_columns = ["Category (Blue/Orange/Green)", "Description of Liability", "Annual Avoidance Cost ($)", "Est. Future Cleanup Cost ($)", "Lost Opportunity Cost ($)", "TOTAL DEBT ($)", "What Happens If We Default?"]
ledger_data = [["", "", 0, 0, 0, 0, ""] for _ in range(15)] # 15 empty rows to start

# --- DATAFRAME CREATION ---
df_instruct = pd.DataFrame(instructions_data)
# Create examples dataframe with all columns including scenario
example_columns = ["Category (Blue/Orange/Green)", "Description of Liability", "Annual Avoidance Cost ($)", "Est. Future Cleanup Cost ($)", "Lost Opportunity Cost ($)", "Default Scenario"]
df_examples = pd.DataFrame(examples_data, columns=example_columns)
df_examples["TOTAL DEBT ($)"] = 0 # Placeholder for formula
df_ledger = pd.DataFrame(ledger_data, columns=ledger_columns)

# --- WRITING TO EXCEL ---
writer = pd.ExcelWriter(filename, engine='xlsxwriter')
workbook = writer.book

# FORMATS
fmt_header = workbook.add_format({'bold': True, 'font_color': 'white', 'bg_color': '#2C3E50', 'border': 1, 'align': 'center', 'valign': 'vcenter'})
fmt_cell = workbook.add_format({'border': 1, 'valign': 'vcenter'})
fmt_currency = workbook.add_format({'num_format': '$#,##0', 'border': 1, 'valign': 'vcenter'})
fmt_total = workbook.add_format({'bold': True, 'bg_color': '#F2F3F4', 'num_format': '$#,##0', 'border': 1})
fmt_title = workbook.add_format({'bold': True, 'font_size': 16, 'font_color': '#2C3E50'})
fmt_subtitle = workbook.add_format({'italic': True, 'font_color': '#7F8C8D'})
fmt_warning = workbook.add_format({'bold': True, 'font_size': 14, 'font_color': '#C0392B', 'bg_color': '#FCF3CF'})
fmt_grand_total = workbook.add_format({'bold': True, 'font_size': 20, 'font_color': '#C0392B', 'num_format': '$#,##0', 'border': 2, 'bg_color': '#FCF3CF'})

# --- TAB 0: DASHBOARD ---
sheet_name = "Dashboard"
worksheet = workbook.add_worksheet(sheet_name)

# Title and branding
worksheet.write('A1', f"{org_name}: Developmental Debt Audit", fmt_title)
worksheet.write('A2', "The bill is coming due. This is what you owe.", fmt_subtitle)
worksheet.write('A3', f"Read the full manifesto: {website}/blog/the-bill-is-coming-due")

# Warning box
worksheet.merge_range('A5:D5', '⚠️ THE MARGIN CALL', fmt_warning)

# Summary metrics - link to Audit Ledger
worksheet.write('A7', 'Your Total Developmental Debt:', fmt_header)
worksheet.write_formula('B7', "='The Audit Ledger'!F19", fmt_grand_total)

worksheet.write('A9', 'Annual Avoidance Cost:', fmt_header)
worksheet.write_formula('B9', "='The Audit Ledger'!C19", fmt_total)

worksheet.write('A10', 'Future Cleanup Cost:', fmt_header)
worksheet.write_formula('B10', "='The Audit Ledger'!D19", fmt_total)

worksheet.write('A11', 'Lost Opportunity Cost:', fmt_header)
worksheet.write_formula('B11', "='The Audit Ledger'!E19", fmt_total)

# Breakdown by type
worksheet.write('A14', 'Debt Breakdown by Stage:', fmt_header)
worksheet.write('A15', 'Blue Debt (Rigidity):', fmt_cell)
worksheet.write('A16', 'Orange Debt (Externalization):', fmt_cell)
worksheet.write('A17', 'Green Debt (Paralysis):', fmt_cell)

# These would require SUMIF formulas - for now, placeholder text
worksheet.write('B15', 'Calculate in Audit Ledger', fmt_cell)
worksheet.write('B16', 'Calculate in Audit Ledger', fmt_cell)
worksheet.write('B17', 'Calculate in Audit Ledger', fmt_cell)

# Instructions
worksheet.write('A20', 'NEXT STEPS:', fmt_header)
worksheet.write('A21', '1. Go to "The Audit Ledger" tab and fill in your organizational debts')
worksheet.write('A22', '2. See "Examples" tab for guidance')
worksheet.write('A23', '3. Return here to see your total exposure')
worksheet.write('A24', '4. Use this number in your strategic planning')

# Column widths
worksheet.set_column('A:A', 35)
worksheet.set_column('B:B', 25)
worksheet.set_column('C:D', 20)

# --- TAB 1: INSTRUCTIONS ---
sheet_name = "Start Here"
df_instruct.to_excel(writer, sheet_name=sheet_name, startrow=4, index=False)
worksheet = writer.sheets[sheet_name]

# Branding
worksheet.write('A1', f"{org_name}: Developmental Debt Calculator", fmt_title)
worksheet.write('A2', "Why the crisis isn't a failure of morals, but a failure of accounting.", fmt_subtitle)
worksheet.write('A3', f"Get the Manifesto at: {website}")

# Formatting
worksheet.set_column('A:A', 10)
worksheet.set_column('B:B', 30)
worksheet.set_column('C:C', 80)
for col_num, value in enumerate(df_instruct.columns.values):
    worksheet.write(4, col_num, value, fmt_header)

# --- TAB 2: THE AUDIT LEDGER (CALCULATOR) ---
sheet_name = "The Audit Ledger"
df_ledger.to_excel(writer, sheet_name=sheet_name, startrow=2, index=False)
worksheet = writer.sheets[sheet_name]

# Formatting
worksheet.set_column('A:A', 25) # Category
worksheet.set_column('B:B', 50) # Description
worksheet.set_column('C:E', 20) # Costs
worksheet.set_column('F:F', 20) # Total
worksheet.set_column('G:G', 40) # Default Scenario

# Headers
for col_num, value in enumerate(df_ledger.columns.values):
    worksheet.write(2, col_num, value, fmt_header)

# Write Formulas for the rows (now 15 rows)
# Rows start at index 3 (Excel row 4)
for row_num in range(3, 18):
    # F = C + D + E
    cell_formula = f'=SUM(C{row_num+1}:E{row_num+1})'
    worksheet.write_formula(row_num, 5, cell_formula, fmt_total)
    
    # Apply currency format to input cells
    worksheet.write_blank(row_num, 2, None, fmt_currency)
    worksheet.write_blank(row_num, 3, None, fmt_currency)
    worksheet.write_blank(row_num, 4, None, fmt_currency)
    
    # Apply standard format to text cells
    worksheet.write_blank(row_num, 0, None, fmt_cell)
    worksheet.write_blank(row_num, 1, None, fmt_cell)
    worksheet.write_blank(row_num, 6, None, fmt_cell)

# Grand Total Row
grand_total_row = 18
worksheet.write(grand_total_row, 4, "GRAND TOTAL DEBT:", fmt_header)
worksheet.write_formula(grand_total_row, 5, f'=SUM(F4:F18)', fmt_grand_total)

# Add summary by category row
worksheet.write(grand_total_row + 2, 1, "Breakdown by Stage:", fmt_header)
worksheet.write(grand_total_row + 3, 1, "Blue Debt:", fmt_cell)
worksheet.write(grand_total_row + 4, 1, "Orange Debt:", fmt_cell)
worksheet.write(grand_total_row + 5, 1, "Green Debt:", fmt_cell)

# --- TAB 3: EXAMPLES ---
sheet_name = "Examples"
df_examples.to_excel(writer, sheet_name=sheet_name, startrow=1, index=False)
worksheet = writer.sheets[sheet_name]

worksheet.set_column('A:A', 25)
worksheet.set_column('B:B', 50)
worksheet.set_column('C:F', 20)
worksheet.set_column('G:G', 40)

for col_num, value in enumerate(df_examples.columns.values):
    worksheet.write(1, col_num, value, fmt_header)

# Write example formulas and data
for i in range(len(df_examples)):
    row_num = i + 2
    cell_formula = f'=SUM(C{row_num+1}:E{row_num+1})'
    worksheet.write_formula(row_num, 5, cell_formula, fmt_currency)
    # Rewrite the data cells with currency format
    for col in range(2, 5):
        worksheet.write(row_num, col, df_examples.iloc[i, col], fmt_currency)
    # Write the default scenario text
    worksheet.write(row_num, 6, df_examples.iloc[i, 6], fmt_cell)

# --- FINALIZE ---
writer.close()
print(f"File '{filename}' created successfully.")
