from flask import Blueprint, request, jsonify, current_app

api_bp = Blueprint('api', __name__)

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = current_app.get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
        
    cursor = conn.cursor(dictionary=True)
    # Using simple plain-text password check for demo purposes
    cursor.execute("SELECT id, username, role FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user:
        return jsonify({'success': True, 'user': user, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@api_bp.route('/dashboard/stats', methods=['GET'])
def dashboard_stats():
    conn = current_app.get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
        
    cursor = conn.cursor(dictionary=True)
    
    # Get total inventory items
    cursor.execute("SELECT SUM(quantity) as total FROM inventory")
    result = cursor.fetchone()
    inventory_count = int(result['total']) if result['total'] else 0
    
    # Get total active students
    cursor.execute("SELECT COUNT(*) as total FROM students WHERE status = 'Active'")
    students_count = cursor.fetchone()['total']
    
    # Get total sales amount
    cursor.execute("SELECT SUM(total_amount) as total FROM billing WHERE status = 'Paid'")
    result = cursor.fetchone()
    sales_total = float(result['total']) if result['total'] else 0.0
    
    cursor.close()
    conn.close()
    
    return jsonify({
        'success': True,
        'stats': {
            'inventory_items': inventory_count,
            'active_students': students_count,
            'total_sales': sales_total
        }
    })

@api_bp.route('/inventory', methods=['GET'])
def get_inventory():
    conn = current_app.get_db_connection()
    if not conn: return jsonify({'success': False, 'message': 'DB error'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM inventory")
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'data': items})

@api_bp.route('/students', methods=['GET'])
def get_students():
    conn = current_app.get_db_connection()
    if not conn: return jsonify({'success': False, 'message': 'DB error'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'data': students})

@api_bp.route('/billing', methods=['GET'])
def get_billing():
    conn = current_app.get_db_connection()
    if not conn: return jsonify({'success': False, 'message': 'DB error'}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM billing ORDER BY date DESC LIMIT 10")
    invoices = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'data': invoices})
