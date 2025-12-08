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
    ["Blue Debt (Rigidity)", "Legacy IT System maintained to avoid upgrade pain", 500000, 2000000, 5000000],
    ["Orange Debt (Externalization)", "Ignoring Supply Chain Carbon/Human Rights risks", 150000, 10000000, 0],
    ["Green Debt (Paralysis)", "Decision-making gridlock due to 'consensus' culture", 1200000, 0, 3000000],
]

# 3. EMPTY LEDGER STRUCTURE (For the user to fill)
# We create a dataframe with empty rows for them to fill in
ledger_columns = ["Category (Blue/Orange/Green)", "Description of Liability", "Annual Avoidance Cost ($)", "Est. Future Cleanup Cost ($)", "Lost Opportunity Cost ($)", "TOTAL DEBT ($)"]
ledger_data = [["", "", 0, 0, 0, 0] for _ in range(10)] # 10 empty rows to start

# --- DATAFRAME CREATION ---
df_instruct = pd.DataFrame(instructions_data)
df_examples = pd.DataFrame(examples_data, columns=ledger_columns[:-1]) # Exclude total, let excel calc it
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

# Headers
for col_num, value in enumerate(df_ledger.columns.values):
    worksheet.write(2, col_num, value, fmt_header)

# Write Formulas for the rows
# Rows start at index 3 (Excel row 4)
for row_num in range(3, 13):
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

# Grand Total Row
grand_total_row = 13
worksheet.write(grand_total_row, 4, "GRAND TOTAL DEBT:", fmt_header)
worksheet.write_formula(grand_total_row, 5, f'=SUM(F4:F13)', fmt_header)

# --- TAB 3: EXAMPLES ---
sheet_name = "Examples"
df_examples.to_excel(writer, sheet_name=sheet_name, startrow=1, index=False)
worksheet = writer.sheets[sheet_name]

worksheet.set_column('A:A', 25)
worksheet.set_column('B:B', 50)
worksheet.set_column('C:F', 20)

for col_num, value in enumerate(df_examples.columns.values):
    worksheet.write(1, col_num, value, fmt_header)

# Write example formulas
for i in range(len(df_examples)):
    row_num = i + 2
    cell_formula = f'=SUM(C{row_num+1}:E{row_num+1})'
    worksheet.write_formula(row_num, 5, cell_formula, fmt_currency)
    # Rewrite the data cells with currency format
    for col in range(2, 5):
        worksheet.write(row_num, col, df_examples.iloc[i, col], fmt_currency)

# --- FINALIZE ---
writer.close()
print(f"File '{filename}' created successfully.")
